import React, { useMemo, useState } from "react";

/**
 * Plot.jsx
 * - Renders a scatter plot (safety vs cost) with connecting line.
 * - Tooltip on hover, axis labels, gridlines.
 * - Points are sorted by cost before connecting so the line makes sense.
 *
 * Props:
 *  - points: [{ cost, safety, name }]
 */
export default function Plot({ points = [] }) {
  const width = 760;
  const height = 320;
  const pad = 56;

  const [hover, setHover] = useState(null); // {x,y,point}

  // normalize data, sort by cost for the line
  const prepared = useMemo(() => {
    const arr = points
      .map(p => ({ cost: Number(p.cost || 0), safety: Number(p.safety || 0), name: p.name || "" }))
      .sort((a, b) => a.cost - b.cost);
    return arr;
  }, [points]);

  if (!prepared || prepared.length === 0) {
    return <div className="muted small" style={{ padding: 18 }}>No points to plot.</div>;
  }

  const xs = prepared.map(p => p.cost);
  const ys = prepared.map(p => p.safety);
  const minX = Math.min(...xs, 0);
  const maxX = Math.max(...xs, 1);
  const minY = Math.min(...ys, 0);
  const maxY = Math.max(...ys, 1);

  const xScale = v => pad + ((v - minX) / (maxX - minX || 1)) * (width - pad * 2);
  const yScale = v => height - pad - ((v - minY) / (maxY - minY || 1)) * (height - pad * 2);

  // line path connecting points in cost order
  const linePath = prepared.map((p, i) => {
    const x = xScale(p.cost);
    const y = yScale(p.safety);
    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
  }).join(" ");

  // grid ticks
  const xTicks = 5;
  const yTicks = 5;
  const xTickVals = Array.from({ length: xTicks + 1 }, (_, i) => minX + (i / xTicks) * (maxX - minX));
  const yTickVals = Array.from({ length: yTicks + 1 }, (_, i) => minY + (i / yTicks) * (maxY - minY));

  return (
    <div style={{ width: "100%", height: height, position: "relative" }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%" }}>
        {/* background card */}
        <rect x="0" y="0" width={width} height={height} rx="12" fill="rgba(255,255,255,0.01)" />

        {/* grid lines and ticks */}
        <g opacity={0.12} stroke="rgba(255,255,255,0.08)" strokeWidth="1">
          {yTickVals.map((v, i) => {
            const y = yScale(v);
            return <line key={"gy"+i} x1={pad} x2={width - pad} y1={y} y2={y} />;
          })}
          {xTickVals.map((v, i) => {
            const x = xScale(v);
            return <line key={"gx"+i} x1={x} x2={x} y1={pad} y2={height - pad} />;
          })}
        </g>

        {/* axes */}
        <line x1={pad} x2={width - pad} y1={height - pad} y2={height - pad} stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" />
        <line x1={pad} x2={pad} y1={pad} y2={height - pad} stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" />

        {/* axis labels */}
        <text x={pad - 6} y={pad - 18} fontSize="12" fill="rgba(230,238,248,0.6)">Safety</text>
        <text x={width - pad} y={height - 8} fontSize="12" fill="rgba(230,238,248,0.6)" textAnchor="end">Cost</text>

        {/* ticks labels */}
        <g fill="rgba(230,238,248,0.45)" fontSize="11">
          {yTickVals.map((v,i) => <text key={"yt"+i} x={pad - 10} y={yScale(v)+4} textAnchor="end">{Math.round(v)}</text>)}
          {xTickVals.map((v,i) => <text key={"xt"+i} x={xScale(v)} y={height - pad + 18} textAnchor="middle">{Math.round(v)}</text>)}
        </g>

        {/* line (smoothed slightly) */}
        <path d={linePath} fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />

        {/* points */}
        <defs>
          <linearGradient id="pointGrad" x1="0" x2="1">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#6EE7B7" />
          </linearGradient>
          <linearGradient id="lineGrad" x1="0" x2="1">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#6EE7B7" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {prepared.map((p, i) => {
          const cx = xScale(p.cost);
          const cy = yScale(p.safety);
          return (
            <g key={i}
               onMouseEnter={(ev) => setHover({ x: ev.clientX, y: ev.clientY, point: p })}
               onMouseMove={(ev) => setHover({ x: ev.clientX, y: ev.clientY, point: p })}
               onMouseLeave={() => setHover(null)}
               style={{ cursor: "pointer" }}
            >
              {/* subtle outer glow */}
              <circle cx={cx} cy={cy} r={10} fill="url(#pointGrad)" opacity={0.12} filter="url(#glow)" />
              <circle cx={cx} cy={cy} r={6} fill="url(#pointGrad)" stroke="#021124" strokeWidth="1.2" />
              <text x={cx + 10} y={cy - 10} fontSize="12" fill="rgba(230,238,248,0.85)">{p.name}</text>
            </g>
          );
        })}
      </svg>

      {/* tooltip */}
      {hover && hover.point && (
        <div style={{
          position: "absolute",
          pointerEvents: "none",
          left: Math.min(Math.max(hover.x - 20, 12), window.innerWidth - 240),
          top: Math.min(Math.max(hover.y - 60, 12), window.innerHeight - 120),
          background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
          color: "#E6EEF8",
          padding: "8px 10px",
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 8px 30px rgba(2,17,36,0.6)",
          fontSize: 13,
          backdropFilter: "blur(6px)"
        }}>
          <div style={{ fontWeight: 700 }}>{hover.point.name || "Item"}</div>
          <div className="muted small">Cost: ₹ {Number(hover.point.cost).toLocaleString()}</div>
          <div className="muted small">Safety: {hover.point.safety}</div>
        </div>
      )}
    </div>
  );
}
    