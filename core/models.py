from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class Intervention(BaseModel):
    id: str
    location: str
    category: str
    issue: str
    recommendation: str
    clause: Optional[str] = None  # e.g., "IRC:67-2022 14.8.8"
    clause_url: Optional[str] = None  # online source URL when available

class ParsedReport(BaseModel):
    source_name: str
    interventions: List[Intervention]

class ItemizedCost(BaseModel):
    intervention_id: str
    sku: str
    description: str
    clause: Optional[str]
    clause_url: Optional[str]
    unit: str
    quantity: float
    unit_price: float
    total_price: float
    price_source: str  # "CPWD" or "GeM"
    assumptions: Optional[str] = None

class BOMLine(BaseModel):
    sku: str
    description: str
    unit: str
    total_quantity: float
    unit_price: float
    total_price: float
    price_source: str

class IPSScore(BaseModel):
    intervention_id: str
    ips: float
    components: Dict[str, float]  # safety_gain, risk_severity, urgency_weight, cost

class EstimationResponse(BaseModel):
    items: List[ItemizedCost]
    bom: List[BOMLine]
    ips: List[IPSScore]
    summary: Dict[str, Any]

    # NEW FIELDS for unique features
    curve_data: List[Dict[str, Any]]   # Cost vs Safety Gain dataset
    top_ips: List[IPSScore]            # Top ranked interventions
    alternatives: Dict[str, List[Dict[str, Any]]]  # Suggested alternatives per SKU
    bom_csv: str                       # BOM export in CSV format
  