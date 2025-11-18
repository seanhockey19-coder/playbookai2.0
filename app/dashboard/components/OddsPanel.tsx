// app/dashboard/components/OddsPanel.tsx
import type { SimplifiedGame } from "@/app/api/nfl/odds/route";

export default function OddsPanel({ game }: { game: SimplifiedGame | null }) {
  return (
    <div
      style={{
        background: "#050910",
        borderRadius: "1rem",
        border: "1px solid #151a23",
        padding: "1.1rem 1.2rem",
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
        ODDS
      </h2>

      {!game && (
        <p style={{ color: "#7f8aa3", fontSize: "0.9rem" }}>
          Select a game to view live market lines.
        </p>
      )}

      {game && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.75rem",
            }}
          >
            <div>
              <div style={{ color: "#cfd7ea", fontWeight: 600 }}>
                {game.awayTeam}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "#cfd7ea", fontWeight: 600 }}>
                {game.homeTeam}
              </div>
            </div>
          </div>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.9rem",
            }}
          >
            <thead>
              <tr style={{ color: "#7f8aa3" }}>
                <th style={{ textAlign: "left", padding: "0.3rem 0" }}>
                  Market
                </th>
                <th style={{ textAlign: "right", padding: "0.3rem 0" }}>
                  Away
                </th>
                <th style={{ textAlign: "right", padding: "0.3rem 0" }}>
                  Home
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "0.3rem 0", color: "#9aa6c2" }}>
                  Moneyline
                </td>
                <td style={{ textAlign: "right" }}>
                  {game.h2h?.outcomes?.[0]?.price ?? "—"}
                </td>
                <td style={{ textAlign: "right" }}>
                  {game.h2h?.outcomes?.[1]?.price ?? "—"}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0.3rem 0", color: "#9aa6c2" }}>
                  Spread
                </td>
                <td style={{ textAlign: "right" }}>
                  {game.spreads?.outcomes?.[0]
                    ? `${game.spreads.outcomes[0].point} (${game.spreads.outcomes[0].price})`
                    : "—"}
                </td>
                <td style={{ textAlign: "right" }}>
                  {game.spreads?.outcomes?.[1]
                    ? `${game.spreads.outcomes[1].point} (${game.spreads.outcomes[1].price})`
                    : "—"}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0.3rem 0", color: "#9aa6c2" }}>
                  Total
                </td>
                <td style={{ textAlign: "right" }}>
                  {game.totals?.outcomes?.[0]
                    ? `${game.totals.outcomes[0].name.toUpperCase()} ${
                        game.totals.outcomes[0].point ?? ""
                      } (${game.totals.outcomes[0].price})`
                    : "—"}
                </td>
                <td style={{ textAlign: "right" }}>
                  {game.totals?.outcomes?.[1]
                    ? `${game.totals.outcomes[1].name.toUpperCase()} ${
                        game.totals.outcomes[1].point ?? ""
                      } (${game.totals.outcomes[1].price})`
                    : "—"}
                </td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
