import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Panel from "./components/Panel";
import Toasts from "./components/Toasts";
import "./styles/index.css";

/**
 * App holds global results state so panels can display results
 * produced by earlier steps (pdf -> curve -> ips -> bom).
 */
export default function App() {
  const [active, setActive] = useState("estimate_pdf");

  // Global results accessible across panels
  const [estimateResult, setEstimateResult] = useState(null); // raw JSON from /estimate_pdf
  const [curveResult, setCurveResult] = useState(null);       // raw JSON from /curve_data
  const [ipsResult, setIpsResult] = useState(null);           // raw JSON from /ips_ranking
  const [bomResult, setBomResult] = useState(null);           // raw JSON from /bom

  // Toast helper: we keep in app and pass showToast to panel
  const [toasts, setToasts] = useState([]);
  function showToast(message, kind = "info", duration = 4000) {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), duration);
  }

  return (
    <div className="app-root">
      <div className="container">
        <aside className="sidebar">
          <Sidebar active={active} setActive={setActive} />
        </aside>

        <main className="main">
          <Panel
            active={active}
            setActive={setActive}
            showToast={showToast}
            estimateResult={estimateResult}
            setEstimateResult={setEstimateResult}
            curveResult={curveResult}
            setCurveResult={setCurveResult}
            ipsResult={ipsResult}
            setIpsResult={setIpsResult}
            bomResult={bomResult}
            setBomResult={setBomResult}
          />
        </main>
      </div>

      <Toasts toasts={toasts} />
    </div>
  );
}
