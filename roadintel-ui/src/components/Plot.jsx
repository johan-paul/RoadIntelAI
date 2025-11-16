import React from "react";

function getBounds(points) {
  const xs = points.map(p=>p.cost);
  const ys = points.map(p=>p.safety);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  return {minX, maxX, minY, maxY};
}

export default function Plot({ points = [] }) {
  const w = 900;
  const h = 320;
  const pad = 60;
  if (!points.length) return <div className="muted small">No points</div>;
  const {minX, maxX, minY, maxY} = getBounds(points);
  const scaleX = (x) => {
    if (maxX === minX) return pad + (w - 2*pad)/2;
    return pad + ((x - minX) / (maxX - minX)) * (w - 2*pad);
  };
  const scaleY = (y) => {
    if (maxY === minY) return pad + (h - 2*pad)/2;
    return h - pad - ((y - minY) / (maxY - minY)) * (h - 2*pad);
  };
  const sorted = [...points].sort((a,b)=>a.cost - b.cost);
  const path = sorted.map((p,i)=>`${i===0?"M":"L"} ${scaleX(p.cost)} ${scaleY(p.safety)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="chart">
      <rect x="0" y="0" width={w} height={h} rx="12" fill="rgba(255,255,255,0.02)"/>
      <g>
        <line x1={pad} y1={h-pad} x2={w-pad} y2={h-pad} stroke="rgba(255,255,255,0.06)"/>
        <line x1={pad} y1={pad} x2={pad} y2={h-pad} stroke="rgba(255,255,255,0.06)"/>
        <text x={w-pad} y={h-pad+28} textAnchor="end" fill="rgba(255,255,255,0.4)" fontSize="12">Cost</text>
        <text x={pad-40} y={pad-10} textAnchor="start" fill="rgba(255,255,255,0.4)" fontSize="12">Safety</text>
      </g>
      <defs>
        <linearGradient id="gline" x1="0" x2="1">
          <stop offset="0" stopColor="#8e6cff"/>
          <stop offset="1" stopColor="#5ab6ff"/>
        </linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="2.2" result="b"/></filter>
      </defs>
      <path d={path} fill="none" stroke="url(#gline)" strokeWidth="2.2" opacity="0.9"/>
      {sorted.map((p,i)=>{
        const cx = scaleX(p.cost);
        const cy = scaleY(p.safety);
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r="8" fill="#1f2430" stroke="url(#gline)" strokeWidth="2.5" />
            <circle cx={cx} cy={cy} r="5" fill="#ffffff" opacity="0.06" />
            <text x={cx+12} y={cy-8} fontSize="12" fill="#e9f1ff" style={{fontWeight:700}}>{p.name || `P${i+1}`}</text>
            <text x={cx+12} y={cy+8} fontSize="11" fill="rgba(255,255,255,0.6)">{`s:${p.safety} c:${p.cost}`}</text>
          </g>
        );
      })}
    </svg>
  );
}
