// app/dashboard/components/AIGameBreakdown.tsx
import type { SimplifiedGame } from "@/app/api/nfl/odds/route";

interface Props {
  game: SimplifiedGame | null;
  loading: boolean;
}

export default function AIGameBreakdown({ game, loading }: Props) {
  return (
    <div
      style={{
        background: "#050910",
        borderRadius: "1rem",
        border: "1px solid #151a23",
        padding: "1.1rem 1.2rem",
        minHeight: "220px",
      }}
    >
      <h2
        style={{
          fontSize: "0.95rem",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "#7f8aa3",
          marginBottom: "0.6rem",
        }}
      >
        AI GAME BREAKDOWN{" "}
        <span style={{ fontWeight: 400, color: "#4f5b74" }}>
          (Live Market)
        </span>
      </h2>

      {loading && <p style={{ color: "#7f8aa3" }}>Loading odds…</p>}
      {!loading && !game && (
        <p style={{ color: "#7f8aa3" }}>Select a game to see breakdown.</p>
      )}

      {!loading && game && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1.2rem",
              marginBottom: "0.9rem",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  color: "#7f8aa3",
                  marginBottom: "0.2rem",
                }}
              >
                Away
              </div>
              <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>
                {game.awayTeam}
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  color: "#7f8aa3",
                  marginBottom: "0.2rem",
                }}
              >
                Projected Total
              </div>
              <div style={{ fontSize: "1.4rem", color: "#00f2ff" }}>
                {game.totalLine ?? "—"}
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  color: "#7f8aa3",
                  marginBottom: "0.2rem",
                }}
              >
                Home
              </div>
              <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>
                {game.homeTeam}
              </div>
            </div>
          </div>

          <p style={{ fontSize: "0.9rem", color: "#b1bdd8", lineHeight: 1.5 }}>
            The matchup between {game.awayTeam} and {game.homeTeam} currently
            profiles as a{" "}
            <span style={{ color: "#00f2ff" }}>fast-paced game</span> with a
            live total around{" "}
            <span style={{ color: "#00f2ff" }}>
              {game.totalLine ?? "the market consensus"}
            </span>
            . As lines move, this panel will update to highlight where the AI
            thinks the edge is, especially on{" "}
            <span style={{ color: "#00f2ff" }}>alternate totals</span> and{" "}
            <span style={{ color: "#00f2ff" }}>moneyline shifts</span>.
          </p>
        </>
      )}
    </div>
  );
}
