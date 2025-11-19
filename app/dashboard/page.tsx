"use client";

import { useEffect, useMemo, useState } from "react";
import SportSwitcher from "./components/SportSwitcher";

type Sport = "nfl" | "nba";

interface Game {
  id: string;
  sport: Sport;
  awayTeam: string;
  homeTeam: string;
  projectedTotal?: number;
  kickoff?: string; // ISO string or display text
}

// Fallback data if the API is empty/errored
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
      awayTeam: "New York Giants",
      homeTeam: "Philadelphia Eagles",
      projectedTotal: 46.5,
      kickoff: "Sun 1:00 PM ET",
    },
    {
      id: "commanders-falcons",
      sport: "nfl",
      awayTeam: "Washington Commanders",
      homeTeam: "Atlanta Falcons",
      projectedTotal: 44.0,
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

const pageShell: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  background: "radial-gradient(circle at top, #1e293b 0, #020617 55%, #000 100%)",
  color: "white",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"SF Pro Text","system-ui",sans-serif',
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
  boxShadow:
    "0 26px 56px rgba(15,23,42,0.95), 0 0 0 1px rgba(15,23,42,0.9) inset",
};

const subtleLabel: React.CSSProperties = {
  fontSize: "0.75rem",
  textTransform: "uppercase",
  letterSpacing: "0.09em",
  color: "rgba(148,163,184,0.9)",
  marginBottom: "0.25rem",
};

const headingLg: React.CSSProperties = {
  fontSize: "1.5rem",
  fontWeight: 600,
};

const dropdown: React.CSSProperties = {
  width: "100%",
  maxWidth: "480px",
  padding: "0.55rem 0.75rem",
  borderRadius: "0.85rem",
  border: "1px solid rgba(148,163,184,0.45)",
  backgroundColor: "rgba(15,23,42,0.95)",
  color: "white",
  fontSize: "0.95rem",
};

const navItem: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.6rem",
  padding: "0.55rem 0.75rem",
  borderRadius: "0.9rem",
  fontSize: "0.9rem",
  cursor: "pointer",
  color: "rgba(209,213,219,0.9)",
};

const navItemActive: React.CSSProperties = {
  ...navItem,
  background: "linear-gradient(135deg,#3b82f6,#22c55e)",
  color: "#0f172a",
  boxShadow: "0 16px 40px rgba(15,23,42,0.85)",
};

export default function DashboardPage() {
  const [sport, setSport] = useState<Sport>("nfl");
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [isLoadingGames, setIsLoadingGames] = useState(false);

  // Load games whenever the sport changes
  useEffect(() => {
    let isMounted = true;

    async function load() {
      setIsLoadingGames(true);
      try {
        const res = await fetch(`/api/games?sport=${sport}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Bad response");
        const data = await res.json();

        const apiGames: Game[] =
          Array.isArray(data?.games) && data.games.length > 0
            ? data.games
            : [];

        const finalGames = apiGames.length ? apiGames : MOCK_GAMES[sport];

        if (!isMounted) return;
        setGames(finalGames);
        setSelectedGameId(finalGames[0]?.id ?? null);
      } catch (e) {
        if (!isMounted) return;
        const fallback = MOCK_GAMES[sport];
        setGames(fallback);
        setSelectedGameId(fallback[0]?.id ?? null);
      } finally {
        if (isMounted) setIsLoadingGames(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [sport]);

  const selectedGame = useMemo(
    () => games.find((g) => g.id === selectedGameId) ?? games[0] ?? null,
    [games, selectedGameId],
  );

  // Simple stub data based on game + sport (you can later plug in your real edges/props)
  const aiPicks = useMemo(() => {
    if (!selectedGame) return [];
    if (sport === "nfl") {
      return [
        {
          label: "CeeDee Lamb o5.5 receptions",
          edge: "+7%",
        },
        {
          label: "Davante Adams o67.5 yards",
          edge: "+5%",
        },
      ];
    }
    return [
      { label: "Steph Curry o3.5 threes", edge: "+6%" },
      { label: "Jayson Tatum o24.5 points", edge: "+4%" },
    ];
  }, [sport, selectedGame]);

  return (
    <div style={pageShell}>
      {/* LEFT NAV */}
      <aside style={sideNav}>
        <div>
          <div style={{ marginBottom: "2rem" }}>
            <div style={{ fontSize: "0.8rem", color: "rgba(148,163,184,0.9)" }}>
              Coaches
            </div>
            <div style={{ fontSize: "1.25rem", fontWeight: 600 }}>PlaybookAI</div>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <div style={navItemActive}>Dashboard</div>
            <div style={navItem}>AI Picks</div>
            <div style={navItem}>Ladder Challenge</div>
            <div style={navItem}>Game Breakdown</div>
            <div style={navItem}>Player Props</div>
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
          Alpha build · internal use only
        </div>
      </aside>

      {/* MAIN */}
      <main style={mainArea}>
        {/* Top row: title + sport switch + game dropdown */}
        <div
          style={{
            display: "flex",
            gap: "1.25rem",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <div style={subtleLabel}>
              Live matchup breakdown, AI picks, value scan and player props for today&apos;s
              games.
            </div>
            <h1 style={headingLg}>
              {sport === "nfl" ? "NFL Dashboard" : "NBA Dashboard"}
            </h1>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.9rem",
            }}
          >
            <SportSwitcher sport={sport} onChange={setSport} />
          </div>
        </div>

        {/* Game selector */}
        <div style={{ ...cardBase, marginTop: "0.25rem" }}>
          <div style={subtleLabel}>Game</div>
          {isLoadingGames ? (
            <div style={{ fontSize: "0.9rem", opacity: 0.7 }}>Loading games…</div>
          ) : games.length === 0 ? (
            <div style={{ fontSize: "0.9rem", opacity: 0.7 }}>
              No games found. Check your odds API or try again later.
            </div>
          ) : (
            <select
              style={dropdown}
              value={selectedGame?.id ?? ""}
              onChange={(e) => setSelectedGameId(e.target.value)}
            >
              {games.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.awayTeam} @ {g.homeTeam}
                  {g.kickoff ? ` · ${g.kickoff}` : ""}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Middle row: Game breakdown + AI snapshot */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,2.5fr) minmax(0,1.7fr)",
            gap: "1.25rem",
          }}
        >
          {/* Game breakdown */}
          <section style={cardBase}>
            <div style={subtleLabel}>Game Breakdown</div>
            {selectedGame ? (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: "0.85rem",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "rgba(148,163,184,0.95)",
                      }}
                    >
                      Away
                    </div>
                    <div style={{ fontSize: "1.05rem", fontWeight: 600 }}>
                      {selectedGame.awayTeam}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      textAlign: "right",
                      color: "rgba(148,163,184,0.9)",
                    }}
                  >
                    Projected total{" "}
                    <span style={{ fontWeight: 600 }}>
                      {selectedGame.projectedTotal ?? "—"}
                    </span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "rgba(148,163,184,0.95)",
                      }}
                    >
                      Home
                    </div>
                    <div style={{ fontSize: "1.05rem", fontWeight: 600 }}>
                      {selectedGame.homeTeam}
                    </div>
                  </div>
                </div>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "rgba(148,163,184,0.95)",
                    lineHeight: 1.45,
                  }}
                >
                  Our game model expects a{" "}
                  {sport === "nfl" ? "high-tempo, pass-heavy script" : "fast-paced, perimeter-heavy game"}{" "}
                  with both offenses pushing the pace. This panel will update as new odds and
                  injury news come in.
                </p>
              </>
            ) : (
              <div style={{ fontSize: "0.9rem", opacity: 0.7 }}>
                Select a game above to see the breakdown.
              </div>
            )}
          </section>

          {/* AI Picks Snapshot */}
          <section style={cardBase}>
            <div style={subtleLabel}>AI Picks Snapshot</div>
            {selectedGame ? (
              <>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "rgba(148,163,184,0.95)",
                    marginBottom: "0.75rem",
                  }}
                >
                  Quick look at the top AI edges for this matchup. For a full card, use the AI
                  Picks tab.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {aiPicks.map((pick) => (
                    <div
                      key={pick.label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.88rem",
                      }}
                    >
                      <span>{pick.label}</span>
                      <span style={{ color: "#22c55e", fontWeight: 600 }}>{pick.edge}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ fontSize: "0.9rem", opacity: 0.7 }}>
                Select a game to see AI edges.
              </div>
            )}
          </section>
        </div>

        {/* Bottom row: Line value scan + Props feed */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,2.5fr) minmax(0,1.7fr)",
            gap: "1.25rem",
          }}
        >
          {/* Line value scan */}
          <section style={cardBase}>
            <div style={subtleLabel}>
              Line Value Scan · based on implied probability vs market
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,minmax(0,1fr))",
                gap: "0.75rem",
                marginTop: "0.75rem",
              }}
            >
              <LineValueCard label="Spread" top="Cowboys -3.5 (+145)" bottom="Edge +2.5% vs market" />
              <LineValueCard label="Total" top="Over 55.5 (+145)" bottom="Edge +1.7% vs market" />
              <LineValueCard label="Moneyline" top="Raiders +150" bottom="Upset alert spot" />
            </div>
          </section>

          {/* Props feed */}
          <section style={cardBase}>
            <div style={subtleLabel}>Props Feed</div>
            <p
              style={{
                fontSize: "0.85rem",
                color: "rgba(148,163,184,0.95)",
                lineHeight: 1.45,
              }}
            >
              If you&apos;re seeing an API error here, double-check your{" "}
              <code style={{ fontSize: "0.8rem" }}>ODDS_API_KEY</code> in Vercel &gt; Settings
              &gt; Environment Variables and redeploy.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

interface LineValueCardProps {
  label: string;
  top: string;
  bottom: string;
}

function LineValueCard({ label, top, bottom }: LineValueCardProps) {
  return (
    <div
      style={{
        borderRadius: "1rem",
        background:
          "radial-gradient(circle at top left, rgba(37,99,235,0.25), rgba(15,23,42,0.98))",
        border: "1px solid rgba(148,163,184,0.45)",
        padding: "0.85rem 0.9rem",
      }}
    >
      <div style={{ fontSize: "0.75rem", color: "rgba(148,163,184,0.95)" }}>{label}</div>
      <div style={{ fontSize: "0.95rem", fontWeight: 600, marginTop: "0.25rem" }}>{top}</div>
      <div
        style={{
          marginTop: "0.15rem",
          fontSize: "0.8rem",
          color: "rgba(74,222,128,0.9)",
        }}
      >
        {bottom}
      </div>
    </div>
  );
}
