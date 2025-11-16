import React from "react";

function TabButton({ id, label, active, onClick }) {
  return (
    <button
      onClick={() => onClick(id)}
      className={"tab-button " + (active ? "active" : "")}
      type="button"
    >
      <div className="tab-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2v20M2 12h20" stroke="#9BD3FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="tab-text">
        <div className="tab-title">{label}</div>
        <div className="tab-sub">POST /{id}</div>
      </div>

      <div className="tab-state">{active ? "Active" : "Run"}</div>
    </button>
  );
}

export default function Sidebar({ active, setActive }) {
  // alternatives removed from this list
  const tabs = [
    ["estimate_pdf", "Estimate PDF"],
    ["curve_data", "Curve Data"],
    ["ips_ranking", "IPS Ranking"],
    ["bom", "BOM"],
    ["bom_csv", "BOM CSV"]
  ];

  return (
    <div>
      <div className="branding">
        <div className="logo">
          <div className="logo-inner"/>
        </div>
        <div className="brand-texts">
          <div className="brand-title">RoadIntel</div>
          <div className="brand-sub">AI-driven Road Safety Tools</div>
        </div>
      </div>

      <div className="tabs">
        {tabs.map(([id, label]) => (
          <TabButton key={id} id={id} label={label} active={active === id} onClick={setActive} />
        ))}
      </div>

      <div className="log-card">
        <div className="log-title">Response Log</div>
        <pre className="log-body">Ready.</pre>
      </div>
    </div>
  );
}
