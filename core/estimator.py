from typing import List, Dict
from .models import ParsedReport, ItemizedCost, BOMLine, EstimationResponse, IPSScore
from .rules import map_to_sku, estimate_quantity, safety_gain, risk_and_urgency, sku_meta
from .fetchers.irc_fetcher import find_irc_clause_url
from .fetchers.gem_fetcher import fetch_gem_price_live
import json

FALLBACK = json.load(open("data/cpwd_rates.json"))

def fetch_unit_price(sku: str):
    name = sku_meta(sku)["desc"] if sku_meta(sku) else sku
    price, url = fetch_gem_price_live(name)
    if price:
        return price, "GeM Live", url
    if sku in FALLBACK and FALLBACK[sku] is not None:
        return FALLBACK[sku], "CPWD Catalog", "https://cpwd.gov.in/"
    return 0.0, "Unknown", ""

def build_itemized(report: ParsedReport) -> List[ItemizedCost]:
    items: List[ItemizedCost] = []
    for iv in report.interventions:
        sku = map_to_sku(iv.issue, iv.recommendation)
        if not sku:
            clause_url, _title = find_irc_clause_url(iv.clause or "")
            items.append(ItemizedCost(
                intervention_id=iv.id,
                sku="UNKNOWN",
                description="Unknown item (add rule)",
                clause=iv.clause,
                clause_url=clause_url,
                unit="nos",
                quantity=1.0,
                unit_price=0.0,
                total_price=0.0,
                price_source="Unknown",
                assumptions="No mapping rule matched; requires SKU rule addition."
            ))
            continue

        qty, assumptions = estimate_quantity(sku, iv.issue, iv.recommendation)
        price, source, source_url = fetch_unit_price(sku)
        meta = sku_meta(sku) or {"desc": sku, "unit": "nos"}
        clause_url, _title = find_irc_clause_url(iv.clause or "")
        total = round(qty * price, 2) if price else 0.0

        items.append(ItemizedCost(
            intervention_id=iv.id,
            sku=sku,
            description=meta["desc"],
            clause=iv.clause,
            clause_url=clause_url,
            unit=meta["unit"],
            quantity=qty,
            unit_price=price,
            total_price=total,
            price_source=source,
            assumptions=assumptions + (
                " Live GeM price unavailable; fallback to CPWD catalog." if source == "CPWD Catalog" else ""
            )
        ))
    return items

def build_bom(items: List[ItemizedCost]) -> List[BOMLine]:
    agg: Dict[str, Dict] = {}
    for it in items:
        if it.sku == "UNKNOWN":
            continue
        if it.sku not in agg:
            agg[it.sku] = {
                "description": it.description,
                "unit": it.unit,
                "total_quantity": 0.0,
                "unit_price": it.unit_price,
                "total_price": 0.0,
                "price_source": it.price_source
            }
        agg[it.sku]["total_quantity"] += it.quantity
        agg[it.sku]["total_price"] += it.total_price

    bom: List[BOMLine] = []
    for sku, v in agg.items():
        bom.append(BOMLine(
            sku=sku,
            description=v["description"],
            unit=v["unit"],
            total_quantity=round(v["total_quantity"], 2),
            unit_price=v["unit_price"],
            total_price=round(v["total_price"], 2),
            price_source=v["price_source"]
        ))
    return bom

def build_ips(items: List[ItemizedCost], report: ParsedReport) -> List[IPSScore]:
    idx = {iv.id: iv for iv in report.interventions}
    ips_list: List[IPSScore] = []
    for it in items:
        iv = idx.get(it.intervention_id)
        sg = safety_gain(it.sku)
        rs, uw = risk_and_urgency(iv.category, iv.issue)
        cost = it.total_price
        ips = 0.0 if cost <= 0 else (sg / cost) * rs * uw
        ips_list.append(IPSScore(
            intervention_id=it.intervention_id,
            ips=round(ips, 6),
            components={
                "safety_gain": sg,
                "risk_severity": rs,
                "urgency_weight": uw,
                "cost": cost
            }
        ))
    ips_list.sort(key=lambda x: x.ips, reverse=True)
    return ips_list

def build_curve_data(ips_list: List[IPSScore]):
    curve = []
    for it in ips_list:
        comp = it.components
        roi = comp["safety_gain"] / comp["cost"] if comp["cost"] > 0 else 0
        curve.append({
            "id": it.intervention_id,
            "cost": comp["cost"],
            "safety_gain": comp["safety_gain"],
            "roi": round(roi, 4)
        })
    return curve

def rank_interventions(ips_list: List[IPSScore], top_n=5):
    return sorted(ips_list, key=lambda x: x.ips, reverse=True)[:top_n]

ALTERNATIVES = {
    "SIGN_STOP_600MM": ["SIGN_GIVE_WAY_600MM", "SIGN_CAUTION_CHILDREN_600MM"],
    "SIGN_SPEED_LIMIT_600MM": ["SIGN_SCHOOL_AHEAD_600MM", "SIGN_PEDESTRIAN_CROSSING_600MM"],
    "SIGN_NO_PARKING_600MM": ["SIGN_DIVERSION_600MM", "SIGN_DEAD_END_600MM"],
    "SIGN_ROUNDABOUT_600MM": ["SIGN_LEFT_CURVE_600MM", "SIGN_RIGHT_CURVE_600MM"],
    "MARK_LONGITUDINAL_REPAINT": ["MARKING_EDGE_LINE", "MARKING_LANE_LINE"],
    "MARK_PEDESTRIAN_CROSSING": ["MARKING_PEDESTRIAN_CROSSING"],
    "STUD_RETRO_BIDIR": ["ROAD_STUD_RETROREFLECTIVE"],
    "POTHOLE_PATCH_20MM": ["POTHOLE_REPAIR"],
    "SOLAR_BLINKER": ["STREETLIGHT_LED_90W"],
    "SOLAR_BLINKER_REPAIR": ["STREETLIGHT_LED_90W"],
    "DELINEATOR_POLE": ["DELINEATOR_CURVE_SECTION"],
    "FMM_BRIDGE": ["FMM_MINOR_BRIDGE"]
}


def bom_to_csv(bom_list: List[BOMLine]):
    header = "SKU,Description,Unit,Quantity,Unit Price,Total Price,Source\n"
    rows = []
    for b in bom_list:
        rows.append(f"{b.sku},{b.description},{b.unit},{b.total_quantity},{b.unit_price},{b.total_price},{b.price_source}")
    return header + "\n".join(rows)

def estimate_all(report: ParsedReport) -> EstimationResponse:
    items = build_itemized(report)
    bom = build_bom(items)
    ips = build_ips(items, report)

    curve_data = build_curve_data(ips)
    top_ips = rank_interventions(ips, top_n=5)
    alt_suggestions = {it.sku: suggest_alternatives(it.sku, ips) for it in items}
    bom_csv = bom_to_csv(bom)

    summary = {
        "total_interventions": len(report.interventions),
        "mapped_items": sum(1 for i in items if i.sku != "UNKNOWN"),
        "unknown_items": sum(1 for i in items if i.sku == "UNKNOWN"),
        "material_total_cost": round(sum(i.total_price for i in items), 2),
        "official_price_sources_used": list({i.price_source for i in items if i.price_source not in ("Unknown", "")})
    }

    return EstimationResponse(
        items=items,
        bom=bom,
        ips=ips,
        summary=summary,
        curve_data=curve_data,
        top_ips=top_ips,
        alternatives=alt_suggestions,
        bom_csv=bom_csv
    )

def normalize_sku(sku: str) -> str:
    """Normalize SKU strings for consistent matching."""
    return sku.strip().upper()


def suggest_alternatives(sku: str, ips_list: List[IPSScore]):
    """
    Suggest better alternatives for a given SKU.
    Returns alternatives with higher IPS or lower cost,
    and includes a reason for each suggestion.
    """
    normalized = normalize_sku(sku)

    # Try exact match first
    if normalized not in ALTERNATIVES:
        # Fallback: partial match (e.g. SIGN_SPEED_LIMIT vs SIGN_SPEED_LIMIT_600MM)
        alt_skus = []
        for key, values in ALTERNATIVES.items():
            if key in normalized or normalized in key:
                alt_skus = values
                break
        if not alt_skus:
            return []
    else:
        alt_skus = ALTERNATIVES[normalized]

    # Find current intervention details
    current = next((it for it in ips_list if normalize_sku(it.intervention_id) == normalized), None)
    current_ips = current.ips if current else 0
    current_cost = current.components.get("cost", float("inf")) if current else float("inf")

    suggestions = []
    for alt in ips_list:
        alt_id = normalize_sku(alt.intervention_id)
        if alt_id in [normalize_sku(x) for x in alt_skus]:
            alt_ips = alt.ips
            alt_cost = alt.components.get("cost", float("inf"))
            if alt_ips > current_ips or alt_cost < current_cost:
                suggestions.append({
                    "alt_sku": alt.intervention_id,
                    "ips": alt_ips,
                    "cost": alt_cost,
                    "safety_gain": alt.components.get("safety_gain", 0),
                    "reason": "higher IPS" if alt_ips > current_ips else "lower cost"
                })

    return suggestions
