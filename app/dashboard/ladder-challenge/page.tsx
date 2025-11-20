// app/dashboard/ladder-challenge/page.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Sport = "nfl" | "nba";

interface LadderLeg {
  id: string;
  player: string;
  team: string;
  market: string;
  line: string;
  odds: number; // American odds
  edge: number; // %
  confidence: "lock" | "solid" | "sprinkle";
}

interface LadderStep {
  step: number;
  stake: number;
  target: number;
  legs: LadderLeg[];
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

const MOCK_LADDER_LEGS: Record<Sport, LadderLeg[]> = {
  nfl: [
    {
      id: "lamb-rec-lock",
      player: "CeeDee Lamb",
      team: "DAL",
      market: "Receptions",
      line: "5.5 O",
      odds: -550,
      edge: 7.2,
      confidence: "lock",
    },
    {
      id: "pollard-rush-solid",
      player: "Tony Pollard",
      team: "DAL",
      market: "Rushing yards",
      line: "39.5 O",
      odds: -500,
      edge: 5.1,
      confidence: "solid",
    },
    {
      id: "mahomes-pass-lock",
      player: "Patrick Mahomes",
      team: "KC",
      market: "Alt passing yards",
      line: "199.5 O",
      odds: -650,
      edge: 6.4,
      confidence: "lock",
    },
    {
      id: "kelce-rec-solid",
      player: "Travis Kelce",
      team: "KC",
      market: "Alt receptions",
      line: "4.5 O",
      odds: -600,
      edge: 4.9,
      confidence: "solid",
    },
  ],
  nba: [
    {
      id: "curry-points-lock",
      player: "Stephen Curry",
      team: "GSW",
      market: "Alt points",
      line: "19.5 O",
      odds: -550,
      edge: 6.8,
      confidence: "lock",
    },
    {
      id: "tatum-pra-solid",
      player: "Jayson Tatum",
      team: "BOS",
      market: "Alt PRA",
      line: "24.5 O",
      odds: -500,
      edge: 5.3,
      confidence: "solid",
    },
    {
      id: "haliburton-assists-lock",
      player: "Tyrese Haliburton",
      team: "IND",
      market: "Alt assists",
      line: "6.5 O",
      odds: -600,
      edge: 7.1,
      confidence: "lock",
    },
    {
      id: "giannis-rebounds-solid",
      player: "Giannis Antetokounmpo",
      team: "MIL",
      market: "Alt rebounds",
      line: "7.5 O",
      odds: -550,
      edge: 4.7,
      confidence: "solid",
    },
  ],
};

function buildLadderSteps(sport: Sport): LadderStep[] {
  const legs = MOCK_LADDER_LEGS[sport];

  return BASE_LADDER_STAKES.map((tier, index) => {
    // For now we just rotate through the legs to keep it simple.
    const stepLegs: LadderLeg[] = [];

    // Day 1–3: 3-leg safer ladders, after that 4-leg
    const numLegs = index < 3 ? 3 : 4;

    for (let i = 0; i < numLegs; i++) {
      stepLegs.push(legs[(index + i) % legs.length]);
    }

    return {
      step: tier.step,
      stake: tier.stake,
      target: tier.target,
      legs: stepLegs,
    };
  });
}

export default function LadderChallengePage() {
  const [sport, setSport] = useState<Sport>("nfl");
  const [currentStep, setCurrentStep] = useState<number>(1);

  const steps = useMemo(() => buildLadderSteps(sport), [sport]);
  const selected = steps.find((s) => s.step === currentStep) ?? steps[0];

  const impliedTotalOdds = useMemo(() => {
    // Rough combined odds estimate from legs
    const decimal = selected.legs.reduce((acc, leg) => {
      const dec = leg.odds < 0 ? 1 + 100 / Math.abs(leg.odds) : 1 + leg.odds / 100;
      return acc * dec;
    }, 1);

    const american =
      decimal >= 2 ? Math.round((decimal - 1) * 100) : Math.round(-100 / (decimal - 1));

    return { decimal, american };
  }, [selected]);

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
            Structured bankroll climb using low-risk legs in the -500 to -1000 range.
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

      <div className="grid lg:grid-cols-[280px,minmax(0,1fr)] gap-6">
        {/* Steps list */}
        <div className="space-y-3">
          <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">
            Ladder Steps
          </div>
          {steps.map((step) => {
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
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-400">
                  Current Step
                </div>
                <div className="text-lg font-semibold">
                  Day {selected.step}: Stake ${selected.stake.toFixed(0)} → Target $
                  {selected.target.toFixed(0)}
                </div>
              </div>
              <div className="text-right text-xs text-slate-400">
                Approx combined odds:{" "}
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
                Recommended Legs
              </div>
              <div className="text-xs text-slate-400">
                Target range: -500 to -1000 per leg
              </div>
            </div>

            <div className="space-y-3">
              {selected.legs.map((leg) => (
                <div
                  key={leg.id}
                  className="flex items-center justify-between rounded-lg bg-slate-900/70 px-3 py-2 text-sm"
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold">
                      {leg.player} <span className="text-xs text-slate-400">({leg.team})</span>
                    </div>
                    <div className="text-xs text-slate-400">
                      {leg.market} · {leg.line}
                    </div>
                  </div>
                  <div className="text-right space-y-0.5">
                    <div className="font-mono text-xs text-slate-100">
                      {leg.odds > 0 ? "+" : ""}
                      {leg.odds}
                    </div>
                    <div
                      className={`text-xs ${
                        leg.edge >= 6
                          ? "text-emerald-400"
                          : leg.edge >= 4
                          ? "text-amber-400"
                          : "text-slate-300"
                      }`}
                    >
                      Edge {leg.edge.toFixed(1)}%
                    </div>
                    <div className="text-[10px] uppercase tracking-wide text-slate-400">
                      {leg.confidence === "lock"
                        ? "Lock"
                        : leg.confidence === "solid"
                        ? "Solid"
                        : "Sprinkle"}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-3 text-[11px] text-slate-500">
              *Edge = model win probability minus market implied probability. A +7% edge means our
              model thinks this leg wins 7 percentage points more often than the market is pricing in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
