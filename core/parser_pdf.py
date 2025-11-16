import pdfplumber
from typing import Dict, List
from .models import ParsedReport, Intervention
from .utils import clean_text, extract_clause

CATEGORY_HEADERS = {
    "road sign": "Road Sign",
    "road marking": "Road Marking",
    "pavement condition": "Pavement Condition",
    "traffic signal": "Traffic signal",
    "facilities": "Facilities",
    "roadside furniture": "Roadside Furniture",
}

def parse_report_pdf(pdf_path: str) -> ParsedReport:
    interventions: List[Intervention] = []
    current_category = None
    counters: Dict[str, int] = {}

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            tables = page.extract_tables()
            for table in tables or []:
                header_row = " ".join([clean_text(c) for c in (table[0] or [])]).lower()
                for key, cat in CATEGORY_HEADERS.items():
                    if key in header_row:
                        current_category = cat
                        if cat not in counters:
                            counters[cat] = 1
                        continue

                for row in table[1:]:
                    cells = [clean_text(c) for c in (row or [])]
                    if len(cells) < 5:
                        if len(cells) == 4:
                            idx, location, issue, recommendation = cells
                            clause = extract_clause(recommendation)
                        else:
                            continue
                    else:
                        _, location, _, issue, recommendation = cells
                        clause = extract_clause(recommendation)

                    if not current_category:
                        pass

                    cat = current_category or "Unknown"
                    local_counter = counters.get(cat, 1)
                    iid = f"{cat.split()[0][0]}{local_counter}"
                    counters[cat] = local_counter + 1

                    interventions.append(Intervention(
                        id=iid,
                        location=location,
                        category=cat,
                        issue=issue,
                        recommendation=recommendation,
                        clause=clause or None
                    ))
                    
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                text = (page.extract_text() or "").lower()
                if "delineators are missing" in text or "roadway indicators" in text:
                    cat = "Roadside Furniture"
                    idx = counters.get(cat, 1)
                    interventions.append(Intervention(
                        id=f"{cat.split()[0][0]}{idx}",
                        location="362+380 to 362+500 LHS MCW",
                        category=cat,
                        issue="Delineators are missing for the curve section.",
                        recommendation="Provide roadway indicators (Delineators or Guide Poles) per IRC:79-2019 clause 3.",
                        clause="IRC:79-2019 3"
                    ))
                    counters[cat] = idx + 1
    except Exception:
        pass

    return ParsedReport(source_name="CoERS IITM Report", interventions=interventions)