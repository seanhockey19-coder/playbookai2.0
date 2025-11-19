"use client";

export default function PropsPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
        background:
          "radial-gradient(circle at top, #1e293b 0, #020617 55%, #000 100%)",
        color: "white",
        fontFamily:
          '-apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,sans-serif',
      }}
    >
      {/* BACK BUTTON */}
      <button
        onClick={() => (window.location.href = "/dashboard")}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "999px",
          background: "linear-gradient(135deg,#3b82f6,#22c55e)",
          color: "#0f172a",
          fontWeight: 600,
          border: "none",
          cursor: "pointer",
          marginBottom: "1.5rem",
        }}
      >
        ← Back to Dashboard
      </button>

      <h1 style={{ fontSize: "1.7rem", fontWeight: 600 }}>Player Props</h1>

      <p style={{ marginTop: "0.5rem", color: "rgba(148,163,184,0.9)" }}>
        View passing, rushing, receiving, and scoring props for any player.
      </p>

      <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <PropCard label="Josh Allen — Passing Yards" line="256.5" proj="278" />
        <PropCard label="Saquon Barkley — Rush Yards" line="62.5" proj="74" />
        <PropCard label="Amon-Ra St Brown — Receptions" line="6.5" proj="7.2" />
      </div>
    </div>
  );
}

function PropCard({
  label,
  line,
  proj,
}: {
  label: string;
  line: string;
  proj: string;
}) {
  return (
    <div
      style={{
        padding: "1rem 1.25rem",
        borderRadius: "1rem",
        background:
          "radial-gradient(circle at top left, rgba(37,99,235,0.12), rgba(15,23,42,0.95))",
        border: "1px solid rgba(148,163,184,0.35)",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div style={{ fontSize: "1rem" }}>{label}</div>
      <div style={{ textAlign: "right" }}>
        <div>Line: {line}</div>
        <div style={{ color: "#22c55e", fontWeight: 600 }}>Proj: {proj}</div>
      </div>
    </div>
  );
}
