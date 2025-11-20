// app/dashboard/ladder-challenge/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Sport = "nfl" | "nba";

interface Game {
  id: string;
  homeTeam: string;
  awayTeam: string;
  commence: string;
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

interface LadderStep {
  step: number;
  stake: number;
  target: number;
  legs: PlayerProp[];
}

const BASE_LADDER_STAKES = [
  { step: 1, stake: 10, target: 20 },
  { step: 2, stake: 20, target: 40 },
  { step: 3, stake: 40, target: 80 },
  { step: 4, stake: 80, target: 160 },
  { step: 5, stake: 160, target: 320 },
  { step: 6, stake: 320, target: 640 },
  { step: 7, stake: 640, target: 1280 },
  { step: 8, stake: 1280, target: 2560 },
  { step: 9, stake: 2560, target: 5120 },
];

async function loadNFLGames(): Promise<Game[]> {
  const res = await fetch("/api/nfl/games", { cache: "no-store" });
  if (!res.ok) return [];
  const raw = await res.json();
  return raw.map((g: any) => ({
    id: g.id,
    homeTeam: g.homeTeam,
    awayTeam: g.awayTeam,
    commence: g.commence,
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
    commence: g.commence,
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

function buildLadder(props: PlayerProp[]): LadderStep[] {
  // Filter for -1000 to -500 legs (safer ladder legs)
  const pool = props.filter((p) => p.odds <= -500 && p.odds >= -1000);

  if (pool.length === 0) {
    return BASE_LADDER_STAKES.map((tier) => ({
      step: tier.step,
      stake: tier.stake,
      target: tier.target,
      legs: [],
    }));
  }

  return BASE_LADDER_STAKES.map((tier, index) => {
    const legs: PlayerProp[] = [];
    const numLegs = index < 3 ? 3 : 4; // early days 3 legs, later 4

    for (let i = 0; i < numLegs; i++) {
      legs.push(pool[(index + i) % pool.length]);
    }

    return {
      step: tier.step,
      stake: tier.stake,
      target: tier.target,
      legs,
    };
  });
}

export default function LadderChallengePage() {
  const [sport, setSport] = useState<Sport>("nfl");
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGameId, setSelectedGameId] = useState("");
  const [ladder, setLadder] = useState<LadderStep[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      setLoading(true);
      const loadedGames = sport === "nfl" ? await loadNFLGames() : await loadNBAGames();
      setGames(loadedGames);
      const firstId = loadedGames[0]?.id ?? "";
      setSelectedGameId(firstId);
      setLoading(false);
    }
    init();
  }, [sport]);

  useEffect(() => {
    async function loadLadder() {
      if (!selectedGameId) {
        setLadder([]);
        return;
      }
      setLoading(true);
      const props =
        sport === "nfl"
          ? await loadNFLProps(selectedGameId)
          : await loadNBAProps(selectedGameId);

      const built = buildLadder(props);
      setLadder(built);
      setCurrentStep(1);
      setLoading(false);
    }
    loadLadder();
  }, [selectedGameId, sport]);

  const selectedStep = useMemo(
    () => ladder.find((s) => s.step === currentStep) ?? ladder[0],
    [ladder, currentStep]
  );

  const impliedTotalOdds = useMemo(() => {
    if (!selectedStep || selectedStep.legs.length === 0) {
      return { decimal: 1, american: 0 };
    }

    const decimal = selectedStep.legs.reduce((acc, leg) => {
      const dec = leg.odds < 0 ? 1 + 100 / Math.abs(leg.odds) : 1 + leg.odds / 100;
      return acc * dec;
    }, 1);

    const american =
      decimal >= 2 ? Math.round((decimal - 1) * 100) : Math.round(-100 / (decimal - 1));

    return { decimal, american };
  }, [selectedStep]);

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
          <h1 className="text-2xl font-semibold tracking-tight">Ladder Challenge</h1>
          <p className="text-sm text-slate-400">
            Automatically builds a 9-day ladder using safer legs in the -500 to -1000 range from
            live props.
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

      {/* Game selector */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <select
            value={selectedGameId}
            onChange={(e) => setSelectedGameId(e.target.value)}
            className="rounded-md border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm text-slate-100"
          >
            {games.map((g) => (
              <option key={g.id} value={g.id}>
                {g.awayTeam} @ {g.homeTeam} · {formatTime(g.commence)}
              </option>
            ))}
          </select>
          <div className="text-xs text-slate-400">
            Legs will be built from this game&apos;s live props.
          </div>
        </div>

        <div className="text-xs text-slate-500">
          Legs filtered between -500 and -1000 odds.
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-slate-400">Loading ladder from live props…</div>
      ) : ladder.length === 0 ? (
        <div className="text-sm text-slate-400">
          No suitable ladder legs found yet for this game. Try a different matchup or sport.
        </div>
      ) : (
        <div className="grid lg:grid-cols-[280px,minmax(0,1fr)] gap-6">
          {/* Steps list */}
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">
              Ladder Steps
            </div>
            {ladder.map((step) => {
              const isActive = step.step === currentStep;
              const roi = ((step.target - step.stake) / step.stake) * 100;

              return (
                <button
                  key={step.step}
                  onClick={() => setCurrentStep(step.step)}
                  className={`w-full text-left rounded-lg border px-3 py-3 text-sm ${
                    isActive
                      ? "border-sky-500 bg-slate-900/80"
                      : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">Day {step.step}</div>
                    <div className="text-xs text-slate-400">
                      Stake ${step.stake.toFixed(0)} → Target ${step.target.toFixed(0)}
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    Approx. ROI: {roi.toFixed(0)}% · Legs: {step.legs.length}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Step details */}
          {selectedStep && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-slate-400">
                      Current Step
                    </div>
                    <div className="text-lg font-semibold">
                      Day {selectedStep.step}: Stake ${selectedStep.stake.toFixed(0)} → Target $
                      {selectedStep.target.toFixed(0)}
                    </div>
                  </div>
                  <div className="text-right text-xs text-slate-400">
                    Approx combined odds:
                    <div className="font-mono text-sm text-slate-100">
                      {impliedTotalOdds.american > 0 ? "+" : ""}
                      {impliedTotalOdds.american}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs uppercase tracking-wide text-slate-400">
                    Suggested Legs
                  </div>
                  <div className="text-xs text-slate-400">
                    Drawn from live props for this game
                  </div>
                </div>

                {selectedStep.legs.length === 0 ? (
                  <div className="text-sm text-slate-400">
                    No props in the -500 to -1000 window yet for this matchup.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedStep.legs.map((leg) => (
                      <div
                        key={leg.id}
                        className="flex items-center justify-between rounded-lg bg-slate-900/70 px-3 py-2 text-sm"
                      >
                        <div className="space-y-0.5">
                          <div className="font-semibold">{leg.player}</div>
                          <div className="text-xs text-slate-400">
                            {leg.market.replace("player_", "").replace(/_/g, " ")}
                            {leg.line !== null ? ` · ${leg.line}` : ""}
                          </div>
                          <div className="text-[11px] text-slate-500">{leg.game}</div>
                        </div>
                        <div className="text-right space-y-0.5 text-xs">
                          <div className="font-mono text-slate-100">
                            {leg.odds > 0 ? "+" : ""}
                            {leg.odds}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Edge % from model coming soon
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
