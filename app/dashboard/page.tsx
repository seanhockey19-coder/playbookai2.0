"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import SportSwitcher from "./components/SportSwitcher";

type Sport = "nfl" | "nba";

interface Game {
  id: string;
  sport: Sport;
  awayTeam: string;
  homeTeam: string;
  projectedTotal?: number;
  kickoff?: string;
}

// Fallback games
const MOCK_GAMES: Record<Sport, Game[]> = {
  nfl: [
    {
      id: "cowboys-raiders",
      sport: "nfl",
      awayTeam: "Dallas Cowboys",
      homeTeam: "Las Vegas Raiders",
      projectedTotal: 55.5,
      kickoff: "Sun 4:25 PM ET",
    },
    {
      id: "eagles-giants",
      sport: "nfl",
      awayTeam: "NY Giants",
      homeTeam: "Philadelphia Eagles",
      projectedTotal: 46.5,
      kickoff: "Sun 1:00 PM ET",
    },
    {
      id: "commanders-falcons",
      sport: "nfl",
      awayTeam: "Washington Commanders",
      homeTeam: "Atlanta Falcons",
      projectedTotal: 44,
      kickoff: "Sun 1:00 PM ET",
    },
  ],
  nba: [
    {
      id: "warriors-suns",
      sport: "nba",
      awayTeam: "Golden State Warriors",
      homeTeam: "Phoenix Suns",
      projectedTotal: 232.5,
      kickoff: "10:00 PM ET",
    },
    {
      id: "celtics-knicks",
      sport: "nba",
      awayTeam: "Boston Celtics",
      homeTeam: "New York Knicks",
      projectedTotal: 220.5,
      kickoff: "7:30 PM ET",
    },
  ],
};

// ---------- BASE STYLES ----------
const pageShell: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  background: "radial-gradient(circle at top, #1e293b 0, #020617 55%, #000 100%)",
  color: "white",
};

const sideNav: React.CSSProperties = {
  width: "260px",
  background:
    "linear-gradient(180deg, rgba(15,23,42,0.98), rgba(15,23,42,0.95))",
  borderRight: "1px solid rgba(51,65,85,0.9)",
  padding: "1.5rem 1.25rem",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};

const navItem: React.CSSProperties = {
  padding: "0.55rem 0.75rem",
  borderRadius: "0.9rem",
  cursor: "pointer",
  color: "rgba(209,213,219,0.9)",
};

const navItemActive: React.CSSProperties = {
  ...navItem,
  background: "linear-gradient(135deg,#3b82f6,#22c55e)",
  color: "#0f172a",
};

const mainArea: React.CSSProperties = {
  flex: 1,
  padding: "1.75rem 2rem",
  display: "flex",
  flexDirection: "column",
  gap: "1.25rem",
};

const cardBase: React.CSSProperties = {
  borderRadius: "1.25rem",
  background:
    "radial-gradient(circle at top left, rgba(37,99,235,0.08), rgba(15,23,42,0.98))",
  border: "1px solid rgba(148,163,184,0.35)",
  padding: "1.25rem 1.4rem",
};

const subtleLabel: React.CSSProperties = {
  fontSize: "0.75rem",
  textTransform: "uppercase",
  letterSpacing: "0.09em",
  color: "rgba(148,163,184,0.9)",
};

// ----------------------------------------------------------

export default function DashboardPage() {
  const pathname = usePathname();
  const [sport, setSport] = useState<Sport>("nfl");
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  const isActive = (route: string) =>
    pathname.startsWith(route) ? navItemActive : navItem;

  // Fetch games
  useEffect(() => {
    const list = MOCK_GAMES[sport];
    setGames(list);
    setSelectedGameId(list[0]?.id ?? null);
    localStorage.setItem("activeSport", sport);
  }, [sport]);

  const selectedGame = useMemo(
    () => games.find((g) => g.id === selectedGameId) ?? games[0] ?? null,
    [games, selectedGameId]
  );

  const aiPicks = useMemo(() => {
    if (sport === "nfl") {
      return [
        { label: "CeeDee Lamb o5.5 receptions", edge: "+7%" },
        { label: "Davante Adams o67.5 yards", edge: "+5%" },
      ];
    }

    return [
      { label: "Steph Curry o3.5 threes", edge: "+6%" },
      { label: "Jayson Tatum o24.5 points", edge: "+4%" },
    ];
  }, [sport]);

  return (
    <div style={pageShell}>
      {/* SIDEBAR */}
      <aside style={sideNav}>
        <div>
          <div style={{ marginBottom: "2rem" }}>
            <div style={{ fontSize: "0.8rem", color: "rgba(148,163,184,0.9)" }}>
              Coaches
            </div>
            <div style={{ fontSize: "1.25rem", fontWeight: 600 }}>
              PlaybookAI
            </div>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <div
              style={isActive("/dashboard")}
              onClick={() => (window.location.href = "/dashboard")}
            >
              Dashboard
            </div>

            <div
              style={isActive("/ai-picks")}
              onClick={() => (window.location.href = "/ai-picks")}
            >
              AI Picks
            </div>

            <div
              style={isActive("/ladder")}
              onClick={() => (window.location.href = "/ladader")}
            >
              Ladder Challenge
            </div>

            <div
              style={isActive("/game-breakdown")}
              onClick={() => {
                if (selectedGame) {
                  localStorage.setItem(
                    "selectedGame",
                    JSON.stringify(selectedGame)
                  );
                }
                window.location.href = "/game-breakdown";
              }}
            >
              Game Breakdown
            </div>

            <div
              style={isActive("/props")}
              onClick={() => (window.location.href = "/props")}
            >
              Player Props
            </div>
          </nav>
        </div>

        <div
          style={{
            fontSize: "0.75rem",
            color: "rgba(148,163,184,0.9)",
            borderTop: "1px solid rgba(30,64,175,0.7)",
            paddingTop: "0.75rem",
            marginTop: "1rem",
          }}
        >
          Alpha build · internal only
        </div>
      </aside>

      {/* MAIN AREA */}
      <main style={mainArea}>
        {/* HEADER ----------------------- */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <div style={subtleLabel}>Live matchup insights + AI projections</div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>
              {sport.toUpperCase()} Dashboard
            </h1>
          </div>

          <SportSwitcher sport={sport} onChange={setSport} />
        </div>

        {/* GAME DROPDOWN ---------------- */}
        <section style={cardBase}>
          <div style={subtleLabel}>Game</div>

          <select
            style={{
              width: "100%",
              maxWidth: "480px",
              padding: "0.55rem 0.75rem",
              borderRadius: "0.85rem",
              backgroundColor: "rgba(15,23,42,0.95)",
              color: "white",
              border: "1px solid rgba(148,163,184,0.45)",
              fontSize: "0.95rem",
            }}
            value={selectedGameId ?? ""}
            onChange={(e) => setSelectedGameId(e.target.value)}
          >
            {games.map((g) => (
              <option key={g.id} value={g.id}>
                {g.awayTeam} @ {g.homeTeam} · {g.kickoff}
              </option>
            ))}
          </select>
        </section>

        {/* GRID CONTENT ---------------- */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,2.5fr) minmax(0,1.7fr)",
            gap: "1.25rem",
          }}
        >
          {/* GAME BREAKDOWN PANEL (simple placeholder for now) */}
          <section style={cardBase}>
            <div style={subtleLabel}>Game Breakdown</div>
            <p style={{ opacity: 0.7 }}>
              Detailed breakdown is available in the Game Breakdown page.
            </p>
          </section>

          {/* AI PICKS SNAPSHOT */}
          <section style={cardBase}>
            <div style={subtleLabel}>AI Picks Snapshot</div>

            {aiPicks.map((p) => (
              <div
                key={p.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                  fontSize: "0.
85rem",
                }}
              >
                <span>{p.label}</span>
                <span style={{ color: "#22c55e", fontWeight: 600 }}>
                  {p.edge}
                </span>
              </div>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}
