"use client";

import { useEffect, useState } from "react";

export default function GameBreakdownPage() {
  const [game, setGame] = useState<any>(null);

  // Load a selected game from localStorage (set by dashboard)
  useEffect(() => {
    const stored = localStorage.getItem("selectedGame");
    if (stored) setGame(JSON.parse(stored));
  }, []);

  if (!game) {
    return (
      <div
        style={{
          padding: "2rem",
          color: "white",
          fontFamily:
            '-apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,sans-serif',
        }}
      >
        No game selected.
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
        background: "radial-gradient(circle at top, #1e293b 0, #020617 55%, #000 100%)",
        color: "white",
        fontFamily:
          '-apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,sans-serif',
      }}
    >
      <h1
        style={{
          fontSize: "1.75rem",
          marginBottom: "1.5rem",
          fontWeight: 600,
        }}
      >
        {game.awayTeam} @ {game.homeTeam}
      </h1>

      {/* GAME BREAKDOWN CARD */}
      <section
        style={{
          borderRadius: "1.25rem",
          background:
            "radial-gradient(circle at top left, rgba(37,99,235,0.12), rgba(15,23,42,0.98))",
          border: "1px solid rgba(148,163,184,0.35)",
          padding: "1.5rem",
          boxShadow:
            "0 26px 56px rgba(15,23,42,0.95), 0 0 0 1px rgba(15,23,42,0.9) inset",
        }}
      >
        <div
          style={{
            fontSize: "0.85rem",
            color: "rgba(148,163,184,0.9)",
            marginBottom: "1rem",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Game Breakdown
        </div>

        {/* HEADER TEAMS */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1.75rem",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "rgba(148,163,184,0.8)",
              }}
            >
              Away
            </div>
            <div style={{ fontSize: "1.2rem", fontWeight: 600 }}>
              {game.awayTeam}
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "0.75rem",
                color: "rgba(148,163,184,0.8)",
              }}
            >
              Projected Total
            </div>
            <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>
              {game.projectedTotal ?? "—"}
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: "0.75rem",
                color: "rgba(148,163,184,0.8)",
              }}
            >
              Home
            </div>
            <div style={{ fontSize: "1.2rem", fontWeight: 600 }}>
              {game.homeTeam}
            </div>
          </div>
        </div>

        {/* WIN PROBABILITY */}
        <div style={{ marginBottom: "1.75rem" }}>
          <div
            style={{
              fontSize: "0.75rem",
              color: "rgba(148,163,184,0.95)",
              marginBottom: "0.35rem",
            }}
          >
            Win Probability
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.06)",
              height: "18px",
              borderRadius: "999px",
              overflow: "hidden",
              display: "flex",
            }}
          >
            <div
              style={{
                width: "62%",
                background: "linear-gradient(90deg,#3b82f6,#22c55e)",
                transition: "width 0.3s ease",
              }}
            />
            <div style={{ flex: 1 }} />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "0.4rem",
              fontSize: "0.8rem",
              color: "rgba(148,163,184,0.9)",
            }}
          >
            <span>{game.awayTeam} · 62%</span>
            <span>{game.homeTeam} · 38%</span>
          </div>
        </div>

        {/* OFFENSE + DEFENSE */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,minmax(0,1fr))",
            gap: "1.5rem",
          }}
        >
          {/* Offense */}
          <div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "rgba(148,163,184,0.95)",
                marginBottom: "0.5rem",
              }}
            >
              Offensive Outlook
            </div>
            <ul style={{ fontSize: "0.9rem", lineHeight: 1.5 }}>
              <li>Passing Efficiency: +12% edge</li>
              <li>Explosive Pass Rate: Moderate</li>
              <li>Red Zone Conversion: 61%</li>
              <li>Pace: Fast (26.5 sec/play)</li>
            </ul>
          </div>

          {/* Defense */}
          <div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "rgba(148,163,184,0.95)",
                marginBottom: "0.5rem",
              }}
            >
              Defensive Matchups
            </div>
            <ul style={{ fontSize: "0.9rem", lineHeight: 1.5 }}>
              <li>Pass Rush Grade: Top-10</li>
              <li>Coverage Breakdown: Strong perimeter</li>
              <li>Run Defense: Vulnerable inside</li>
              <li>Pressure Rate: 29%</li>
            </ul>
          </div>
        </div>

        {/* WEATHER */}
        <div style={{ marginTop: "1.75rem" }}>
          <div
            style={{
              fontSize: "0.75rem",
              color: "rgba(148,163,184,0.95)",
              marginBottom: "0.25rem",
            }}
          >
            Weather / Conditions
          </div>
          <div
            style={{
              fontSize: "0.9rem",
              color: "rgba(148,163,184,0.95)",
            }}
          >
            Dome · Controlled environment · No weather impact.
          </div>
        </div>

        {/* SUMMARY */}
        <div style={{ marginTop: "1.75rem" }}>
          <div
            style={{
              fontSize: "0.75rem",
              color: "rgba(148,163,184,0.95)",
              marginBottom: "0.25rem",
            }}
          >
            Analysis Summary
          </div>
          <p
            style={{
              fontSize: "1rem",
              color: "rgba(148,163,184,0.95)",
              lineHeight: 1.55,
            }}
          >
            Our model expects a pass-heavy script with measurable edges in
            passing efficiency and defensive pressure. The matchup trends
            strongly toward a fast-paced, high-scoring environment where early
            down success will decide momentum.
          </p>
        </div>
      </section>
    </div>
  );
}
