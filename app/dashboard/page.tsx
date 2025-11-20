// app/dashboard/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Sport = "nfl" | "nba";

interface Game {
  id: string;
  homeTeam: string;
  awayTeam: string;
  commence: string;
  markets: any[];
}

interface SnapshotPick {
  id: string;
  game: string;
  team: string;
  market: string;
  odds: number;
}

async function loadNFLGames(): Promise<Game[]> {
  const res = await fetch("/api/nfl/games", { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

async function loadNBAGames(): Promise<Game[]> {
  const res = await fetch("/api/nba/games", { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

function formatTime(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      weekday: "short",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function DashboardPage() {
  const [sport, setSport] = useState<Sport>("nfl");
  const [nflGames, setNflGames] = useState<Game[]>([]);
  const [nbaGames, setNbaGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  // Load games when dashboard mounts
  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      const [nfl, nba] = await Promise.all([loadNFLGames(), loadNBAGames()]);
      setNflGames(nfl);
      setNbaGames(nba);
      setLoading(false);
    }
    loadAll();
  }, []);

  const games = sport === "nfl" ? nflGames : nbaGames;

  // Simple “AI snapshot” – takes favorite moneyline side from first few games
  const aiSnapshot: SnapshotPick[] = useMemo(() => {
    return games.slice(0, 3).flatMap((g) => {
      const h2h = g.markets?.find((m: any) => m.key === "h2h");
      if (!h2h) return [];
      const outcomes = h2h.outcomes || [];
      if (!outcomes.length) return [];
      // Pick the shorter-odds favorite as the “safer” AI lean
      const favorite = outcomes.reduce((best: any, o: any) =>
        !best ? o : Math.abs(o.price) < Math.abs(best.price) ? o : best
      );
      return {
        id: `${g.id}-${favorite.name}`,
        game: `${g.homeTeam} vs ${g.awayTeam}`,
        team: favorite.name,
        market: "Moneyline",
        odds: favorite.price,
      };
    });
  }, [games]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-400">
            Live NFL & NBA slate with a quick AI-style snapshot built from live odds.
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

      {/* Top row: AI snapshot + quick links */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
        {/* AI snapshot card */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-400">
                AI Picks Snapshot (Odds-Driven)
              </div>
              <div className="text-sm text-slate-300">
                Early leans based on current moneyline favorites.
              </div>
            </div>
            <Link
              href="/dashboard/ai-picks"
              className="text-xs text-sky-400 hover:text-sky-300"
            >
              View full AI picks →
            </Link>
          </div>

          {loading && (
            <div className="text-sm text-slate-400">Loading live odds…</div>
          )}

          {!loading && aiSnapshot.length === 0 && (
            <div className="text-sm text-slate-400">
              No games available yet for this sport.
            </div>
          )}

          <div className="space-y-2">
            {aiSnapshot.map((pick) => (
              <div
                key={pick.id}
                className="flex items-center justify-between rounded-lg bg-slate-900/80 px-3 py-2 text-sm"
              >
                <div>
                  <div className="font-semibold">{pick.team}</div>
                  <div className="text-xs text-slate-400">{pick.game}</div>
                </div>
                <div className="text-right text-xs">
                  <div className="font-mono text-slate-100">
                    {pick.odds > 0 ? "+" : ""}
                    {pick.odds}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Favorite via live moneyline
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-3 text-[11px] text-slate-500">
            This is a simple odds-based preview. Once your full model is ready,
            this card will use true model edges (like the +7% edge we talked about).
          </p>
        </div>

        {/* Quick nav */}
        <div className="space-y-3">
          <div className="text-xs uppercase tracking-wide text-slate-400">
            Quick Navigation
          </div>
          <Link
            href="/dashboard/player-props"
            className="block rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm hover:border-sky-600"
          >
            <div className="font-semibold">Player Props Scanner</div>
            <div className="text-xs text-slate-400">
              Browse live props by game and filter by player or market.
            </div>
          </Link>
          <Link
            href="/dashboard/ladder-challenge"
            className="block rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm hover:border-sky-600"
          >
            <div className="font-semibold">Ladder Challenge</div>
            <div className="text-xs text-slate-400">
              Build low-risk ladders from live props in the -500 to -1000 range.
            </div>
          </Link>
          <Link
            href="/dashboard/game-breakdown"
            className="block rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm hover:border-sky-600"
          >
            <div className="font-semibold">Game Breakdown</div>
            <div className="text-xs text-slate-400">
              Dive into spreads, totals, and props for a single matchup.
            </div>
          </Link>
        </div>
      </div>

      {/* Live slate table */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs uppercase tracking-wide text-slate-400">
            Live {sport.toUpperCase()} Slate
          </div>
          <div className="text-xs text-slate-500">
            {games.length} game{games.length === 1 ? "" : "s"} loaded from Odds API
          </div>
        </div>

        {loading ? (
          <div className="text-sm text-slate-400">Loading games…</div>
        ) : games.length === 0 ? (
          <div className="text-sm text-slate-400">
            No active games for this sport right now.
          </div>
        ) : (
          <div className="space-y-2">
            {games.map((g) => {
              const h2h = g.markets?.find((m: any) => m.key === "h2h");
              const spreads = g.markets?.find((m: any) => m.key === "spreads");
              const total = g.markets?.find((m: any) => m.key === "totals");

              return (
                <div
                  key={g.id}
                  className="rounded-lg bg-slate-900/80 px-3 py-2 text-sm flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="font-semibold">
                      {g.awayTeam} @ {g.homeTeam}
                    </div>
                    <div className="text-xs text-slate-400">
                      {formatTime(g.commence)}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 text-xs text-slate-300">
                    {h2h && (
                      <div>
                        <div className="text-[10px] uppercase text-slate-500">
                          Moneyline
                        </div>
                        <div className="flex gap-2">
                          {h2h.outcomes?.map((o: any) => (
                            <div key={o.name} className="font-mono">
                              {o.name}: {o.price > 0 ? "+" : ""}
                              {o.price}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {spreads && (
                      <div>
                        <div className="text-[10px] uppercase text-slate-500">
                          Spread
                        </div>
                        <div className="flex gap-2">
                          {spreads.outcomes?.map((o: any) => (
                            <div key={o.name} className="font-mono">
                              {o.name}: {o.point} ({o.price > 0 ? "+" : ""}
                              {o.price})
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {total && (
                      <div>
                        <div className="text-[10px] uppercase text-slate-500">
                          Total
                        </div>
                        <div className="flex gap-2">
                          {total.outcomes?.map((o: any) => (
                            <div key={o.name} className="font-mono">
                              {o.name}: {o.point} ({o.price > 0 ? "+" : ""}
                              {o.price})
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
