// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import type { SimplifiedGame } from "../api/nfl/odds/route";
import GameSelector from "./components/GameSelector";
import AIGameBreakdown from "./components/AIGameBreakdown";
import AILineValueScan from "./components/AILineValueScan";
import OddsPanel from "./components/OddsPanel";
import GamePropsPanel from "./components/GamePropsPanel";
import LadderMiniPanel from "./components/LadderMiniPanel";

export default function DashboardPage() {
  const [games, setGames] = useState<SimplifiedGame[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [loadingGames, setLoadingGames] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedGame = games.find((g) => g.id === selectedGameId) ?? null;

  // Load games on mount
  useEffect(() => {
    const load = async () => {
      try {
        setLoadingGames(true);
        setError(null);

        const res = await fetch("/api/nfl/odds");
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "Failed to load odds");
        }

        const events: SimplifiedGame[] = json.events || [];
        setGames(events);
        if (events.length > 0) {
          setSelectedGameId(events[0].id);
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoadingGames(false);
      }
    };

    load();
  }, []);

  return (
    <div>
      <h1
        style={{
          fontSize: "2.1rem",
          fontWeight: 700,
          color: "#00f2ff",
          marginBottom: "0.4rem",
        }}
      >
        AI NFL Dashboard
      </h1>
      <p style={{ color: "#7f8aa3", marginBottom: "1.5rem" }}>
        Live market breakdown, AI picks, line value scan & props for today&apos;s
        games.
      </p>

      {error && (
        <div style={{ color: "#ff8b7f", marginBottom: "1rem" }}>{error}</div>
      )}

      <GameSelector
        games={games}
        selectedGameId={selectedGameId}
        onChange={setSelectedGameId}
        loading={loadingGames}
      />

      {/* GRID LAYOUT */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 3fr) minmax(0, 2fr)",
          gap: "1.4rem",
          alignItems: "flex-start",
        }}
      >
        {/* Left column big breakdown */}
        <AIGameBreakdown game={selectedGame} loading={loadingGames} />

        {/* Right column odds */}
        <OddsPanel game={selectedGame} />
      </div>

      <div
        style={{
          marginTop: "1.4rem",
          display: "grid",
          gridTemplateColumns: "minmax(0, 3fr) minmax(0, 2fr)",
          gap: "1.4rem",
          alignItems: "flex-start",
        }}
      >
        <AILineValueScan game={selectedGame} />
        <GamePropsPanel game={selectedGame} />
      </div>

      <div
        style={{
          marginTop: "1.4rem",
          display: "grid",
          gridTemplateColumns: "minmax(0, 3fr) minmax(0, 2fr)",
          gap: "1.4rem",
        }}
      >
        <LadderMiniPanel />
        {/* Placeholder spot where we’ll later add: mini AI Picks for this game */}
        <div
          style={{
            background: "#070b13",
            borderRadius: "1rem",
            border: "1px solid #161c26",
            padding: "1rem 1.1rem",
          }}
        >
          <h2
            style={{
              fontSize: "1rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#7f8aa3",
              marginBottom: "0.7rem",
            }}
          >
            AI PICKS FEED
          </h2>
          <p style={{ color: "#65708a", fontSize: "0.9rem" }}>
            Full multi-game AI picks feed lives on the{" "}
            <span style={{ color: "#00f2ff" }}>Coaches AI Picks</span> page.
            We&apos;ll also surface game-specific picks here in the next pass.
          </p>
        </div>
      </div>
    </div>
  );
}
