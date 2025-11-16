import React from "react";

/**
 * Toasts.jsx — glassmorphism toast stack
 * Expects toasts = [{ id, message, kind }]
 */
export default function Toasts({ toasts = [] }) {
  return (
    <div style={{
      position: "fixed",
      right: 20,
      top: 20,
      zIndex: 2000,
      display: "flex",
      flexDirection: "column",
      gap: 10
    }}>
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.kind || "info"}`} style={{
          minWidth: 260,
          padding: "12px 14px",
          borderRadius: 12,
          background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02))",
          border: "1px solid rgba(255,255,255,0.06)",
          color: "#E6EEF8",
          boxShadow: "0 10px 30px rgba(2,12,30,0.6)",
          fontWeight: 700,
          fontSize: 13,
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          transform: "translateY(0)",
          animation: "toast-in .28s ease"
        }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            background: t.kind === "success" ? "linear-gradient(90deg,#7C3AED,#6EE7B7)" : t.kind === "error" ? "linear-gradient(90deg,#ff6b6b,#ff9a9a)" : "rgba(255,255,255,0.04)",
            color: t.kind === "error" ? "#2a0808" : "#021124",
            boxShadow: "0 6px 20px rgba(0,0,0,0.45)"
          }}>
            {t.kind === "success" ? "✓" : t.kind === "error" ? "!" : "i"}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800 }}>{t.message}</div>
            {t.sub && <div className="muted small" style={{ marginTop: 6 }}>{t.sub}</div>}
          </div>
        </div>
      ))}
      <style>{`
        @keyframes toast-in {
          from { transform: translateY(-8px) scale(.98); opacity: 0; }
          to   { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
