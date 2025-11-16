from fastapi import FastAPI, File, UploadFile
import tempfile

from core.models import EstimationResponse
from core.estimator import (
    estimate_all,
    build_curve_data,
    build_bom,
    build_ips,
    rank_interventions,
    bom_to_csv,
    build_itemized,
    suggest_alternatives
)
from core.parser_pdf import parse_report_pdf  

app = FastAPI()

@app.post("/estimate_pdf", response_model=EstimationResponse)
async def estimate_pdf(file: UploadFile = File(...)):
    contents = await file.read()
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(contents)
        tmp_path = tmp.name

    report = parse_report_pdf(tmp_path)
    return estimate_all(report)

@app.post("/curve_data")
async def curve_data(file: UploadFile = File(...)):
    contents = await file.read()
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(contents)
        tmp_path = tmp.name

    report = parse_report_pdf(tmp_path)
    items = build_itemized(report)
    ips = build_ips(items, report)
    return build_curve_data(ips)

@app.post("/ips_ranking")
async def ips_ranking(file: UploadFile = File(...), top_n: int = 5):
    contents = await file.read()
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(contents)
        tmp_path = tmp.name

    report = parse_report_pdf(tmp_path)
    items = build_itemized(report)
    ips = build_ips(items, report)
    return rank_interventions(ips, top_n=top_n)

@app.post("/alternatives")
async def alternatives(file: UploadFile = File(...)):
    contents = await file.read()
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(contents)
        tmp_path = tmp.name

    report = parse_report_pdf(tmp_path)
    items = build_itemized(report)
    ips = build_ips(items, report)
    return {it.sku: suggest_alternatives(it.sku, ips) for it in items}

@app.post("/bom")
async def bom(file: UploadFile = File(...)):
    contents = await file.read()
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(contents)
        tmp_path = tmp.name

    report = parse_report_pdf(tmp_path)
    items = build_itemized(report)
    bom = build_bom(items)
    return bom

@app.post("/bom_csv")
async def bom_csv(file: UploadFile = File(...)):
    contents = await file.read()
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(contents)
        tmp_path = tmp.name

    report = parse_report_pdf(tmp_path)
    items = build_itemized(report)
    bom = build_bom(items)
    return {"csv": bom_to_csv(bom)}