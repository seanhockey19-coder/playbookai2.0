// app/dashboard/ai-picks/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Sport = "nfl" | "nba";

interface Game {
  id: string;
  homeTeam: string;
  awayTeam: string;
}

interface PlayerProp {
  id: string;
  sport: string;
  player: string;
  team: string;
  market: string;
  line: number | null;
  odds: number;
  edge: number;
  game: string;
}

async function loadNFLGames(): Promise<Game[]> {
  const res = await fetch("/api/nfl/games", { cache: "no-store" });
  if (!res.ok) return [];
  const raw = await res.json();
  return raw.map((g: any) => ({
    id: g.id,
    homeTeam: g.homeTeam,
    awayTeam: g.awayTeam,
  }));
}

async function loadNBAGames(): Promise<Game[]> {
  const res = await fetch("/api/nba/games", { cache: "no-store" });
  if (!res.ok) return [];
  const raw = await res.json();
  return raw.map((g: any) => ({
    id: g.id,
    homeTeam: g.homeTeam,
    awayTeam: g.awayTeam,
  }));
}

async function loadNFLProps(gameId: string): Promise<PlayerProp[]> {
  const res = await fetch(`/api/nfl/props?gameId=${gameId}`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

async function loadNBAProps(gameId: string): Promise<PlayerProp[]> {
  const res = await fetch(`/api/nba/props?gameId=${gameId}`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

// Temporary “edge” heuristic based on odds only (until real model is plugged in)
function estimateEdgeFromOdds(odds: number): number {
  const impliedProb =
    odds < 0 ? Math.abs(odds) / (Math.abs(odds) + 100) : 100 / (odds + 100);
  // Bias slightly upward for shorter favorites to simulate a +edge look
  const baseline = 0.5;
  const edge = (impliedProb - baseline) * 100;
  return Math.max(0, Math.min(10, edge)); // clamp 0–10%
}

export default function AIPicksPage() {
  const [sport, setSport] = useState<Sport>("nfl");
  const [picks, setPicks] = useState<PlayerProp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPicks() {
      setLoading(true);

      const games =
        sport === "nfl" ? await loadNFLGames() : await loadNBAGames();

      // Take first 3 games for now
      const sampleGames = games.slice(0, 3);

      let allProps: PlayerProp[] = [];

      for (const g of sampleGames) {
        const props =
          sport === "nfl"
            ? await loadNFLProps(g.id)
            : await loadNBAProps(g.id);
        allProps = allProps.concat(props);
      }

      // Compute a fake “edge” off odds UNTIL we plug in the real model
      const withEdge = allProps.map((p) => ({
        ...p,
        edge: estimateEdgeFromOdds(p.odds),
      }));

      // Simple ranking: lower odds + higher “edge”
      const ranked = withEdge
        .filter((p) => p.odds <= -150) // a bit safer
        .sort((a, b) => b.edge - a.edge)
        .slice(0, 15);

      setPicks(ranked);
      setLoading(false);
    }

    loadPicks();
  }, [sport]);

  const byGame = useMemo(() => {
    const map = new Map<string, PlayerProp[]>();
    for (const p of picks) {
      if (!map.has(p.game)) map.set(p.game, []);
      map.get(p.game)!.push(p);
    }
    return Array.from(map.entries());
  }, [picks]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-slate-300 hover:text-slate-100 mb-2"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">AI Picks (Prototype)</h1>
          <p className="text-sm text-slate-400">
            Early “AI-style” leans using live props and a simple odds-based heuristic.
            When your full model is ready, this page will show true model edges.
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

      {loading ? (
        <div className="text-sm text-slate-400">Scanning live props for edges…</div>
      ) : picks.length === 0 ? (
        <div className="text-sm text-slate-400">
          No props matched the current filters yet.
        </div>
      ) : (
        <div className="space-y-4">
          {byGame.map(([game, props]) => (
            <div
              key={game}
              className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"
            >
              <div className="text-xs uppercase tracking-wide text-slate-400 mb-2">
                {game}
              </div>
              <div className="space-y-2 text-sm">
                {props.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-lg bg-slate-900/80 px-3 py-2"
                  >
                    <div>
                      <div className="font-semibold">{p.player}</div>
                      <div className="text-xs text-slate-400">
                        {p.market.replace("player_", "").replace(/_/g, " ")}
                        {p.line !== null ? ` · ${p.line}` : ""}
                      </div>
                    </div>
                    <div className="text-right text-xs">
                      <div className="font-mono text-slate-100">
                        {p.odds > 0 ? "+" : ""}
                        {p.odds}
                      </div>
                      <div
                        className={`text-[10px] ${
                          p.edge >= 6
                            ? "text-emerald-400"
                            : p.edge >= 3
                            ? "text-amber-300"
                            : "text-slate-400"
                        }`}
                      >
                        Est. edge {p.edge.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
