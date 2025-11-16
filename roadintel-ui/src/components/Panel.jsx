import React, { useState, useEffect } from "react";
import Plot from "./Plot";

export default function Panel({
  active,
  setActive,
  showToast,
  estimateResult,
  setEstimateResult,
  curveResult,
  setCurveResult,
  ipsResult,
  setIpsResult,
  bomResult,
  setBomResult,
}) {
  const API = "http://127.0.0.1:8000";

  const [pdfFile, setPdfFile] = useState(null);
  const [bomFile, setBomFile] = useState(null);
  const [ipsTop, setIpsTop] = useState(3);
  const [isProcessing, setIsProcessing] = useState(false);

  const toast = (t, s = "info") => {
    if (typeof showToast === "function") showToast(t, s);
  };

  async function postForm(path, fileObj, setter) {
    try {
      setIsProcessing(true);
      const fd = new FormData();
      fd.append("file", fileObj);
      const r = await fetch(API + path, { method: "POST", body: fd });
      const j = await r.json();
      setter(j);
      toast("Success", "success");
    } catch (e) {
      toast("Error", "error");
    } finally {
      setIsProcessing(false);
    }
  }

  async function postJson(path, body, setter) {
    try {
      setIsProcessing(true);
      const r = await fetch(API + path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const j = await r.json();
      setter(j);
      toast("Success", "success");
    } catch (e) {
      toast("Error", "error");
    } finally {
      setIsProcessing(false);
    }
  }

  function handleEstimatePdf(e) {
    e.preventDefault();
    if (!pdfFile) return toast("Select PDF", "error");

    postForm("/estimate_pdf", pdfFile, (json) => {
      setEstimateResult(json);
      setBomResult(json.bom || []);
      setCurveResult(json.curve_data || []);
      setIpsResult(json.top_ips || json.ips || []);
    });
  }

  function handleBomCsvUpload(e) {
    e.preventDefault();
    if (!bomFile) return toast("Select CSV", "error");
    postForm("/bom_csv", bomFile, (json) => setBomResult(json.bom || json));
  }

  function handleBomRun() {
    postJson("/bom", {}, (json) => setBomResult(json.bom || json));
  }

  function handleIpsRun() {
    postJson("/ips_ranking", { top_n: ipsTop }, (json) =>
      setIpsResult(json.top_ips || json.ips || json)
    );
  }

  function getInterventions() {
    return Array.isArray(estimateResult?.items) ? estimateResult.items : [];
  }

  function getCurvePoints() {
    const arr = curveResult || estimateResult?.curve_data || [];
    return arr.map((p) => ({
      cost: Number(p.cost || 0),
      safety: Number(p.safety_gain || p.safety || 0),
      name: p.id || p.intervention_id || "",
    }));
  }

  function getIpsArray() {
    return Array.isArray(ipsResult) ? ipsResult : [];
  }

  function getBomRows() {
    return Array.isArray(bomResult) ? bomResult : [];
  }

  function downloadBomCsv() {
    const csv = estimateResult?.bom_csv;
    if (!csv) return toast("CSV not provided by backend", "error");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bom.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast("Downloaded", "success");
  }

  function renderEstimateResults() {
    const items = getInterventions();
    if (!items.length) return <div className="muted small">Upload PDF & Run</div>;

    const summary = estimateResult?.summary || {};
    const total = summary.material_total_cost || 0;

    return (
      <div className="results-card">
        <h3>Extracted Interventions</h3>
        <div className="results-table-wrap">
          <table className="results-table">
            <thead>
              <tr>
                <th>#</th>
                <th>SKU / Description</th>
                <th>IRC Clause</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>
                    <b>{it.sku}</b>
                    <div className="muted small">{it.description}</div>
                  </td>
                  <td>
                    <a href={it.clause_url} className="muted small" target="_blank">
                      {it.clause}
                    </a>
                  </td>
                  <td>{it.quantity}</td>
                  <td>{it.unit_price}</td>
                  <td>{it.total_price}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="5" style={{ textAlign: "right" }}>Total</td>
                <td>{total}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <button className="btn primary" onClick={downloadBomCsv}>
          Download BOM CSV
        </button>
      </div>
    );
  }

  function renderCurveResults() {
    const pts = getCurvePoints();
    if (!pts.length) return <div className="muted small">Run Estimate to load graph</div>;
    return (
      <div className="results-card">
        <h3>Safety vs Cost Curve</h3>
        <div style={{ width: "100%", height: 360 }}>
          <Plot points={pts} />
        </div>
      </div>
    );
  }

  function renderIpsResults() {
    const arr = getIpsArray();
    if (!arr.length) return <div className="muted small">Run Estimate first</div>;

    return (
      <div className="results-card">
        <h3>Top IPS Recommendations</h3>
        <div className="results-table-wrap">
          <table className="results-table">
            <thead>
              <tr>
                <th>#</th>
                <th>ID</th>
                <th>IPS</th>
                <th>Safety</th>
                <th>Cost</th>
              </tr>
            </thead>
            <tbody>
              {arr.slice(0, ipsTop).map((r, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{r.intervention_id}</td>
                  <td>{r.ips}</td>
                  <td>{r.components?.safety_gain}</td>
                  <td>{r.components?.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function renderBomResults() {
    const rows = getBomRows();
    if (!rows.length) return <div className="muted small">Run BOM</div>;
    const total = rows.reduce((a, r) => a + (r.total_price || 0), 0);

    return (
      <div className="results-card">
        <h3>Bill of Materials</h3>
        <div className="results-table-wrap">
          <table className="results-table">
            <thead>
              <tr>
                <th>#</th>
                <th>SKU</th>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{r.sku}</td>
                  <td>{r.description}</td>
                  <td>{r.total_quantity}</td>
                  <td>{r.unit}</td>
                  <td>{r.unit_price}</td>
                  <td>{r.total_price}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="6" style={{ textAlign: "right" }}>Total</td>
                <td>{total}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  }

  function renderContent() {
    if (active === "estimate_pdf")
      return (
        <>
          <form onSubmit={handleEstimatePdf} className="panel-form">
            <label className="label">Upload PDF</label>
            <div className="row">
              <input type="file" accept="application/pdf" className="file-input" onChange={(e) => setPdfFile(e.target.files?.[0])} />
              <button className="btn primary" disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Run"}
              </button>
            </div>
          </form>

          <div style={{ marginTop: 18 }}>{renderEstimateResults()}</div>
        </>
      );

    if (active === "curve_data") return renderCurveResults();
    if (active === "ips_ranking")
      return (
        <>
          <label className="label">Top N</label>
          <div className="row">
            <input type="number" min="1" className="input" value={ipsTop} onChange={(e) => setIpsTop(Number(e.target.value))} />
            <button className="btn primary" onClick={handleIpsRun}>
              Run
            </button>
          </div>
          <div style={{ marginTop: 18 }}>{renderIpsResults()}</div>
        </>
      );

    if (active === "bom")
      return (
        <>
          <button className="btn primary" disabled={isProcessing} onClick={handleBomRun}>
            {isProcessing ? "Processing..." : "Run BOM"}
          </button>
          <div style={{ marginTop: 18 }}>{renderBomResults()}</div>
        </>
      );

    if (active === "bom_csv")
      return (
        <>
          <form onSubmit={handleBomCsvUpload}>
            <label className="label">Upload CSV</label>
            <input type="file" accept=".csv" className="file-input" onChange={(e) => setBomFile(e.target.files?.[0])} />
            <button className="btn primary" disabled={isProcessing}>
              {isProcessing ? "Uploading..." : "Upload"}
            </button>
          </form>
        </>
      );
  }

  return (
    <div className="panel-card">
      <div className="panel-header">
        <h1 className="panel-title">{active.replace(/_/g, " ").toUpperCase()}</h1>

        <div className="host-badge">
          <div className="host-small">Backend</div>
          <div className="host-url">{API}</div>
        </div>
      </div>

      <div className="panel-body">{renderContent()}</div>
    </div>
  );
}
