// app/dashboard/player-props/page.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Sport = "nfl" | "nba";

interface PlayerProp {
  id: string;
  sport: Sport;
  game: string;
  player: string;
  team: string;
  market: string;
  line: string;
  odds: number; // American
  edge: number; // %
}

const MOCK_PROPS: PlayerProp[] = [
  {
    id: "nfl-lamb-rec",
    sport: "nfl",
    game: "Dallas Cowboys @ Las Vegas Raiders",
    player: "CeeDee Lamb",
    team: "DAL",
    market: "Receptions",
    line: "5.5 O",
    odds: -145,
    edge: 7.2,
  },
  {
    id: "nfl-adams-rec",
    sport: "nfl",
    game: "New York Jets @ Las Vegas Raiders",
    player: "Davante Adams",
    team: "NYJ", // <- updated team so he's no longer shown as a Raider
    market: "Receiving yards",
    line: "67.5 O",
    odds: -115,
    edge: 5.5,
  },
  {
    id: "nfl-pollard-rush",
    sport: "nfl",
    game: "Dallas Cowboys @ Las Vegas Raiders",
    player: "Tony Pollard",
    team: "DAL",
    market: "Rushing yards",
    line: "59.5 O",
    odds: -110,
    edge: 4.1,
  },
  {
    id: "nba-curry-pts",
    sport: "nba",
    game: "Golden State Warriors @ Phoenix Suns",
    player: "Stephen Curry",
    team: "GSW",
    market: "Points",
    line: "27.5 O",
    odds: -120,
    edge: 6.3,
  },
  {
    id: "nba-tatum-pts",
    sport: "nba",
    game: "Boston Celtics @ New York Knicks",
    player: "Jayson Tatum",
    team: "BOS",
    market: "Points",
    line: "25.5 O",
    odds: -118,
    edge: 4.9,
  },
  {
    id: "nba-haliburton-ast",
    sport: "nba",
    game: "Indiana Pacers @ Chicago Bulls",
    player: "Tyrese Haliburton",
    team: "IND",
    market: "Assists",
    line: "8.5 O",
    odds: -130,
    edge: 7.8,
  },
];

export default function PlayerPropsPage() {
  const [sport, setSport] = useState<Sport>("nfl");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return MOCK_PROPS.filter((p) => {
      if (p.sport !== sport) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        p.player.toLowerCase().includes(q) ||
        p.team.toLowerCase().includes(q) ||
        p.game.toLowerCase().includes(q)
      );
    }).sort((a, b) => b.edge - a.edge);
  }, [sport, search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-slate-300 hover:text-slate-100 mb-2"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">Player Props</h1>
          <p className="text-sm text-slate-400">
            Scan top model edges for player props and filter by sport or player.
          </p>
        </div>

        <div className="inline-flex items-center rounded-full bg-slate-900 p-1 text-xs font-medium">
          <button
            onClick={() => setSport("nfl")}
            className={`px-3 py-1 rounded-full ${
              sport === "nfl" ? "bg-sky-600 text-white" : "text-slate-300"
            }`}
          >
            NFL
          </button>
          <button
            onClick={() => setSport("nba")}
            className={`px-3 py-1 rounded-full ${
              sport === "nba" ? "bg-emerald-500 text-white" : "text-slate-300"
            }`}
          >
            NBA
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs uppercase tracking-wide text-slate-400">
          Showing {filtered.length} props
        </div>
        <div className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search player, team or game..."
            className="w-full sm:w-72 rounded-md border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Props list */}
      <div className="space-y-3">
        {filtered.map((prop) => (
          <div
            key={prop.id}
            className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="space-y-0.5">
              <div className="text-xs text-slate-400">{prop.game}</div>
              <div className="font-semibold">
                {prop.player}{" "}
                <span className="text-xs text-slate-400">({prop.team})</span>
              </div>
              <div className="text-xs text-slate-400">
                {prop.market} · {prop.line}
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="font-mono text-xs text-slate-100">
                {prop.odds > 0 ? "+" : ""}
                {prop.odds}
              </div>
              <div
                className={`text-xs ${
                  prop.edge >= 6
                    ? "text-emerald-400"
                    : prop.edge >= 4
                    ? "text-amber-400"
                    : "text-slate-300"
                }`}
              >
                Edge {prop.edge.toFixed(1)}%
              </div>
              <div className="text-[10px] uppercase tracking-wide text-slate-500">
                Edge = model win prob − market implied prob
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-700 p-6 text-center text-sm text-slate-400">
            No props match your filters yet. Try clearing the search or switching sports.
          </div>
        )}
      </div>
    </div>
  );
}
