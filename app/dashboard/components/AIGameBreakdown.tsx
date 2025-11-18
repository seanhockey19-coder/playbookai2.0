"use client";

interface SimplifiedGame {
  homeTeam: string;
  awayTeam: string;
  homeWinPct: number;
  awayWinPct: number;
  projectedPoints: number;
  pace: string;

  // Odds shape is not consistent — so we allow optional fields
  totalLine?: number;
  total?: number;
  overUnder?: number;
  odds?: {
    total?: number;
  };
}

export default function AIGameBreakdown({ game }: { game: SimplifiedGame }) {
  if (!game) {
    return (
      <div
        style={{
          padding: "1rem",
          border: "1px solid #112233",
          background: "#0c101b",
          borderRadius: "10px",
          color: "#789",
        }}
      >
        No game selected.
      </div>
    );
  }

  // ✅ Safe resolver for total line
  const resolvedTotal =
    game.totalLine ??
    game.total ??
    game.overUnder ??
    game.odds?.total ??
    "—";

  return (
    <div
      style={{
        background: "#0a0f1a",
        padding: "1.4rem",
        borderRadius: "12px",
        border: "1px solid #112233",
        color: "white",
      }}
    >
      <h3
        style={{
          color: "#00f2ff",
          fontSize: "1.2rem",
          marginBottom: "1rem",
          fontWeight: 700,
        }}
      >
        AI Game Breakdown
      </h3>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1.2rem",
        }}
      >
        <div>
          <div style={{ fontSize: "1.1rem", color: "#00f2ff" }}>
            {game.homeTeam}
          </div>
          <div style={{ fontSize: "2rem" }}>{game.homeWinPct}%</div>
        </div>

        <div>
          <div style={{ fontSize: "1.1rem", color: "#00f2ff" }}>
            {game.awayTeam}
          </div>
          <div style={{ fontSize: "2rem" }}>{game.awayWinPct}%</div>
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid #112233",
          paddingTop: "1rem",
          marginTop: "1rem",
        }}
      >
        <div style={{ marginBottom: "0.8rem" }}>
          <strong>Projected Points:</strong> {game.projectedPoints}
        </div>

        <div style={{ marginBottom: "0.8rem" }}>
          <strong>Pace:</strong> {game.pace}
        </div>

        <div>
          <strong>Total Line:</strong>{" "}
          <span style={{ color: "#00f2ff" }}>{resolvedTotal}</span>
        </div>
      </div>
    </div>
  );
}
