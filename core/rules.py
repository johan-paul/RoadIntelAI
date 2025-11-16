import json
import re
from pathlib import Path
from typing import Tuple, Optional, Dict

MAPPING_PATH = Path(__file__).resolve().parent.parent / "data" / "mapping_keywords.json"
KEYWORDS = json.loads(MAPPING_PATH.read_text(encoding="utf-8"))

SKU_META: Dict[str, Dict[str, str]] = {
    "SIGN_SPEED_LIMIT_600MM": {"desc": "Speed limit sign, 600mm, RA2", "unit": "nos"},
    "SIGN_SCHOOL_AHEAD_600MM": {"desc": "School ahead sign, 600mm, RA2", "unit": "nos"},
    "SIGN_FUEL_PUMP_600MM": {"desc": "Fuel pump informatory sign, 600mm, RA2", "unit": "nos"},
    "SIGN_SIDE_ROAD_AHEAD_600MM": {"desc": "Side road ahead sign, 600mm, RA2", "unit": "nos"},
    "SIGN_NO_PARKING_600MM": {"desc": "No Parking sign, 600mm, RA2", "unit": "nos"},
    "SIGN_PEDESTRIAN_CROSSING_600MM": {"desc": "Pedestrian crossing sign, 600mm, RA2", "unit": "nos"},

    "MARK_LONGITUDINAL_REPAINT": {"desc": "Repainting longitudinal markings, thermoplastic", "unit": "m"},
    "MARK_PEDESTRIAN_CROSSING": {"desc": "Pedestrian crossing thermoplastic marking", "unit": "m2"},
    "STUD_RETRO_BIDIR": {"desc": "Retroreflective red-white bidirectional road stud", "unit": "nos"},

    "POTHOLE_PATCH_20MM": {"desc": "Pothole patching 20mm depth (material only)", "unit": "m2"},
    "SOLAR_BLINKER_REPAIR": {"desc": "Repair/replace solar blinker module (material only)", "unit": "nos"},
    "STREETLIGHT_LED_90W": {"desc": "LED streetlight 90W (material only)", "unit": "nos"},
    "FMM_BRIDGE": {"desc": "FMM for minor bridge (retroreflective markers)", "unit": "nos"},
    "DELINEATOR_POLE": {"desc": "Delineator/guide pole with RA2 sheeting", "unit": "nos"}
}

def map_to_sku(issue: str, recommendation: str) -> str:
    text = (issue + " " + recommendation).lower()
    for sku, words in KEYWORDS.items():
        for w in words:
            if w in text:
                return sku
    
    if "pedestrian crossing sign" in text:
        return "SIGN_PEDESTRIAN_CROSSING_600MM"
    return ""

def estimate_quantity(sku: str, issue: str, recommendation: str) -> Tuple[float, Optional[str]]:
    text = (issue + " " + recommendation).lower()
    assumptions = None

    if sku.startswith("SIGN_"):
        return 1.0, "Assume one sign per location."

    if sku == "MARK_LONGITUDINAL_REPAINT":
        m = re.search(r'(\d+(\.\d+)?)\s*m', text)
        if m:
            length_m = float(m.group(1))
            return length_m, f"Length parsed as {length_m} m."
        return 200.0, "Default 200 m where faded length mentioned near college."

    if sku == "MARK_PEDESTRIAN_CROSSING":
        
        return 12.0, "Assume 12 m² per crossing for a single approach."

    if sku == "STUD_RETRO_BIDIR":
        return 20.0, "Assume 20 studs per short segment at 10 m spacing."

    if sku == "POTHOLE_PATCH_20MM":
        m = re.search(r'(\d+(\.\d+)?)\s*sq', text)
        if m:
            area = float(m.group(1))
            return area, f"Area parsed as {area} m²."
        return 2.5, "Default area 2.5 m²."

    if sku == "SOLAR_BLINKER_REPAIR":
        return 1.0, "Assume one blinker module per location."

    if sku == "STREETLIGHT_LED_90W":
        return 10.0, "Assume 10 streetlights for stretch in prototype."

    if sku == "FMM_BRIDGE":
        return 16.0, "Assume 16 markers for minor bridge length 16 m."

    if sku == "DELINEATOR_POLE":
        return 20.0, "Assume 20 delineators on curve section."

    return 1.0, "Default quantity 1."

def safety_gain(sku: str) -> float:
    gains = {
        "SIGN_SPEED_LIMIT_600MM": 10,
        "SIGN_SCHOOL_AHEAD_600MM": 12,
        "SIGN_FUEL_PUMP_600MM": 4,
        "SIGN_SIDE_ROAD_AHEAD_600MM": 6,
        "SIGN_NO_PARKING_600MM": 5,
        "SIGN_PEDESTRIAN_CROSSING_600MM": 8,
        "MARK_LONGITUDINAL_REPAINT": 9,
        "MARK_PEDESTRIAN_CROSSING": 11,
        "STUD_RETRO_BIDIR": 7,
        "POTHOLE_PATCH_20MM": 6,
        "SOLAR_BLINKER_REPAIR": 7,
        "STREETLIGHT_LED_90W": 13,
        "FMM_BRIDGE": 8,
        "DELINEATOR_POLE": 9
    }
    return gains.get(sku, 5)

def risk_and_urgency(category: str, issue: str) -> Tuple[float, float]:
    base = {
        "Road Sign": (1.0, 1.0),
        "Road Marking": (1.1, 1.0),
        "Pavement Condition": (1.2, 1.1),
        "Traffic signal": (1.3, 1.2),
        "Facilities": (1.2, 1.1),
        "Roadside Furniture": (1.1, 1.0),
    }
    rs, uw = base.get(category, (1.0, 1.0))
    s = (issue or "").lower()
    if "school" in s or "academic" in s or "pedestrian" in s:
        uw *= 1.3
        rs *= 1.2
    return rs, uw

def sku_meta(sku: str) -> Optional[Dict[str, str]]:
    return SKU_META.get(sku)