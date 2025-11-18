import type { SimplifiedGame } from "@/app/api/nfl/odds/route";

export default function GameSelector({
  games,
  selectedGameId,
  onChange,
}: {
  games: SimplifiedGame[];
  selectedGameId: string | null;
  onChange: (id: string) => void;
}) {
  return (
    <div
      style={{
        marginBottom: "1.5rem",
        background: "#111",
        padding: "1rem",
        borderRadius: "8px",
        border: "1px solid #333",
      }}
    >
      <h3 style={{ color: "#0ff", marginBottom: "0.5rem" }}>Select Game</h3>

      <select
        value={selectedGameId ?? ""}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "0.8rem",
          background: "#1a1a1a",
          color: "white",
          border: "1px solid #444",
          borderRadius: "6px",
        }}
      >
        {games.map((g) => (
          <option key={g.id} value={g.id}>
            {g.awayTeam} @ {g.homeTeam}
          </option>
        ))}
      </select>
    </div>
  );
}
