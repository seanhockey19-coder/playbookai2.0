{/* Game breakdown */}
<section style={cardBase}>
  <div style={subtleLabel}>Game Breakdown</div>

  {!selectedGame ? (
    <div style={{ fontSize: "0.9rem", opacity: 0.7 }}>
      Select a game above to see the breakdown.
    </div>
  ) : (
    <>
      {/* Header Teams */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.25rem",
        }}
      >
        <div>
          <div style={{ fontSize: "0.75rem", color: "rgba(148,163,184,0.95)" }}>
            Away
          </div>
          <div style={{ fontSize: "1.15rem", fontWeight: 600 }}>
            {selectedGame.awayTeam}
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "0.75rem", color: "rgba(148,163,184,0.8)" }}>
            Projected Total
          </div>
          <div style={{ fontSize: "1rem", fontWeight: 600 }}>
            {selectedGame.projectedTotal ?? "—"}
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "0.75rem", color: "rgba(148,163,184,0.95)" }}>
            Home
          </div>
          <div style={{ fontSize: "1.15rem", fontWeight: 600 }}>
            {selectedGame.homeTeam}
          </div>
        </div>
      </div>

      {/* Win Probability */}
      <div style={{ marginBottom: "1.25rem" }}>
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
            background: "rgba(255,255,255,0.05)",
            height: "16px",
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
            marginTop: "0.35rem",
            fontSize: "0.8rem",
            color: "rgba(148,163,184,0.9)",
          }}
        >
          <span>{selectedGame.awayTeam} · 62%</span>
          <span>{selectedGame.homeTeam} · 38%</span>
        </div>
      </div>

      {/* Offense & Defense Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,minmax(0,1fr))",
          gap: "1rem",
        }}
      >
        {/* Offensive Stats */}
        <div>
          <div style={subtleLabel}>Offensive Outlook</div>
          <ul style={{ fontSize: "0.85rem", lineHeight: "1.45" }}>
            <li>Passing Efficiency: +12% edge</li>
            <li>Explosive Pass Rate: Moderate</li>
            <li>Red Zone Conversion: 61%</li>
            <li>Pace: Fast (26.5 sec/play)</li>
          </ul>
        </div>

        {/* Defensive Stats */}
        <div>
          <div style={subtleLabel}>Defensive Matchups</div>
          <ul style={{ fontSize: "0.85rem", lineHeight: "1.45" }}>
            <li>Pass Rush Grade: Top-10</li>
            <li>Coverage Breakdown: Strong perimeter</li>
            <li>Run Defense: Vulnerable inside</li>
            <li>Pressure Rate: 29%</li>
          </ul>
        </div>
      </div>

      {/* Weather */}
      <div style={{ marginTop: "1.25rem" }}>
        <div style={subtleLabel}>Weather / Conditions</div>
        <div
          style={{
            fontSize: "0.85rem",
            lineHeight: 1.45,
            color: "rgba(148,163,184,0.95)",
          }}
        >
          Dome · Controlled environment · No weather impact.
        </div>
      </div>

      {/* Narrative */}
      <div style={{ marginTop: "1.25rem" }}>
        <div style={subtleLabel}>Analysis Summary</div>
        <p
          style={{
            fontSize: "0.9rem",
            color: "rgba(148,163,184,0.95)",
            lineHeight: 1.45,
          }}
        >
          Our model expects a pass-heavy script with Dallas having a measurable
          edge in explosive pass rate and overall offensive efficiency. The
          Raiders may struggle against pressure, giving the Cowboys a strong
          positional advantage on early downs.
        </p>
      </div>
    </>
  )}
</section>
