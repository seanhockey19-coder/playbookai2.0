"use client";

import { useState } from "react";
import type { SimplifiedGame } from "@/app/api/nfl/odds/route";

// -------------------------------------------------------
// TYPES
// -------------------------------------------------------
interface MarketOption {
  id: string;
  label: string;
  odds: number;
  type: "moneyline" | "spread" | "total";
  valueScore: number;
}

interface ParlayBuilderProps {
  game?: SimplifiedGame;
}

interface ParlayLeg {
  id: string;
  label: string;
  odds: number;
  type: string;
}

// -------------------------------------------------------
// PARLAY BUILDER COMPONENT
// -------------------------------------------------------
export default function ParlayBuilder({ game }: ParlayBuilderProps) {
  const [legs, setLegs] = useState<ParlayLeg[]>([]);

  if (!game) {
    return (
      <div
        style={{
          padding: "1rem",
          background: "#111",
          borderRadius: "8px",
          border: "1px solid #333",
          color: "white",
        }}
      >
        <h2>Parlay Builder</h2>
        <div>No game selected</div>
      </div>
    );
  }

  // -------------------------------------------------------
  // BUILD AVAILABLE MARKETS FROM GAME DATA
  // -------------------------------------------------------
  const buildMarkets = (): MarketOption[] => {
    const markets: MarketOption[] = [];

    // ---- MONEYLINE ----
    game.h2h?.outcomes?.forEach((o) => {
      markets.push({
        id: `ML-${o.name}`,
        label: `${o.name} ML`,
        odds: o.price,
        type: "moneyline",
        valueScore: 1,
      });
    });

    // ---- SPREADS ----
    game.spreads?.outcomes?.forEach((o) => {
      markets.push({
        id: `SP-${o.name}`,
        label: `${o.name} ${o.point > 0 ? "+" : ""}${o.point}`,
        odds: o.price,
        type: "spread",
        valueScore: 1,
      });
    });

    // ---- TOTALS ----
    game.totals?.outcomes?.forEach((o) => {
      markets.push({
        id: `TO-${o.name}`,
        label: `${o.name.toUpperCase()} ${o.point}`,
        odds: o.price,
        type: "total",
        valueScore: 1,
      });
    });

    return markets;
  };

  const marketOptions = buildMarkets();

  // -------------------------------------------------------
  // ADD A LEG
  // -------------------------------------------------------
  const addLeg = (m: MarketOption) => {
    const alreadyIn = legs.some((l) => l.id === m.id);
    if (alreadyIn) return;

    setLegs((prev) => [...prev, m]);
  };

  // -------------------------------------------------------
  // REMOVE A LEG
  // -------------------------------------------------------
  const removeLeg = (id: string) => {
    setLegs((prev) => prev.filter((l) => l.id !== id));
  };

  // -------------------------------------------------------
  // CALCULATE TOTAL ODDS (American Format)
  // -------------------------------------------------------
  const calculateTotalOdds = () => {
    if (legs.length === 0) return 0;

    const decimalLegs = legs.map((leg) => {
      const o = leg.odds;

      if (o > 0) return 1 + o / 100;
      return 1 + 100 / Math.abs(o);
    });

    const decimalTotal = decimalLegs.reduce((acc, val) => acc * val, 1);

    if (decimalTotal >= 2) {
      return Math.round((decimalTotal - 1) * 100);
    } else {
      return Math.round(-100 / (decimalTotal - 1));
    }
  };

  const totalOdds = calculateTotalOdds();

  // -------------------------------------------------------
  // UI
  // -------------------------------------------------------
  return (
    <div
      style={{
        padding: "1rem",
        background: "#111",
        borderRadius: "8px",
        border: "1px solid #333",
        color: "white",
      }}
    >
      <h2 style={{ color: "#0ff", marginBottom: "1rem" }}>
        Parlay Builder – {game.homeTeam} vs {game.awayTeam}
      </h2>

      {/* MARKET SELECTOR */}
      <div
        style={{
          background: "#1a1a1a",
          padding: "1rem",
          borderRadius: "6px",
          marginBottom: "1rem",
        }}
      >
        <h3 style={{ color: "#fff", marginBottom: "0.5rem" }}>
          Add a Market to Your Parlay
        </h3>

        <select
          onChange={(e) => {
            const id = e.target.value;
            const selected = marketOptions.find((m) => m.id === id);
            if (selected) addLeg(selected);
          }}
          style={{
            width: "100%",
            padding: "0.7rem",
            borderRadius: "4px",
            background: "#000",
            color: "white",
            border: "1px solid #333",
          }}
        >
          <option value="">Choose a market…</option>
          {marketOptions.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label} ({m.odds})
            </option>
          ))}
        </select>
      </div>

      {/* CURRENT LEGS */}
      <div>
        <h3>Your Legs ({legs.length})</h3>
        {legs.length === 0 && <div>No legs added yet.</div>}

        {legs.map((l) => (
          <div
            key={l.id}
            style={{
              background: "#222",
              padding: "0.8rem",
              borderRadius: "6px",
              marginBottom: "0.5rem",
            }}
          >
            <strong>{l.label}</strong> — {l.odds}
            <button
              style={{
                float: "right",
                background: "red",
                color: "white",
                border: "none",
                padding: "0.3rem 0.6rem",
                cursor: "pointer",
                borderRadius: "4px",
              }}
              onClick={() => removeLeg(l.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* TOTAL ODDS */}
      <div
        style={{
          marginTop: "1rem",
          fontWeight: "bold",
          fontSize: "1.2rem",
          color: "#0f0",
        }}
      >
        Total Odds: {totalOdds > 0 ? `+${totalOdds}` : totalOdds}
      </div>
    </div>
  );
}
