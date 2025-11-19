"use client";

import { useEffect, useState } from "react";

export default function AIPicksPage() {
  const [sport, setSport] = useState("nfl");

  useEffect(() => {
    const saved = localStorage.getItem("activeSport");
    if (saved) setSport(saved);
  }, []);

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

      <h1 style={{ fontSize: "1.7rem", fontWeight: 600 }}>
        AI Picks — {sport.toUpperCase()}
      </h1>

      <p style={{ marginTop: "0.5rem", color: "rgba(148,163,184,0.9)" }}>
        Top edge-rated props based on your current sport selection.
      </p>

      <div
        style={{
          marginTop: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <AIPick label="CeeDee Lamb — o5.5 Receptions" edge="+7%" />
        <AIPick label="Davante Adams — o67.5 Yards" edge="+5%" />
        <AIPick label="Tony Pollard — o49.5 Rush Yards" edge="+4%" />
      </div>
    </div>
  );
}

function AIPick({ label, edge }: { label: string; edge: string }) {
  return (
    <div
      style={{
        padding: "1rem 1.25rem",
        borderRadius: "1rem",
        background:
          "radial-gradient(circle at top left, rgba(37,99,235,0.15), rgba(15,23,42,0.95))",
        border: "1px solid rgba(148,163,184,0.35)",
        display: "flex",
        justifyContent: "space-between",
        fontSize: "1rem",
      }}
    >
      <span>{label}</span>
      <span style={{ color: "#22c55e", fontWeight: 600 }}>{edge}</span>
    </div>
  );
}
