"use client";

import { useEffect, useState } from "react";
import GameSelector from "./components/GameSelector";
import GameBreakdown from "./components/GameBreakdown";
import OddsCard from "./components/OddsCard";
import PropsCard from "./components/PropsCard";
import ParlayBuilder from "./components/ParlayBuilder";
import LadderGenerator from "./components/LadderGenerator";
import PlayerSelector from "./components/PlayerSelector";

import type { SimplifiedGame } from "../api/nfl/odds/route";

export default function DashboardPage() {
  const [games, setGames] = useState<SimplifiedGame[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch live games
  useEffect(() => {
    const loadGames = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/nfl/odds");
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to load odds");

        setGames(data.events || []);
        setSelectedGameId(data.events?.[0]?.id ?? null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, []);

  const selectedGame = games.find((g) => g.id === selectedGameId);

  // Fetch props for selected game
  const [propsData, setPropsData] = useState<any[]>([]);
  const [loadingProps, setLoadingProps] = useState(false);

  useEffect(() => {
    if (!selectedGame) return;

    const loadProps = async () => {
      try {
        setLoadingProps(true);
        const params = new URLSearchParams({
          home: selectedGame.homeTeam,
          away: selectedGame.awayTeam,
        });

        const res = await fetch(`/api/nfl/props?${params}`);
        const json = await res.json();

        setPropsData(json.props || []);
      } catch {
        setPropsData([]);
      } finally {
        setLoadingProps(false);
      }
    };

    loadProps();
  }, [selectedGameId]);

  return (
    <div>
      <h1 style={{ fontSize: "2rem", color: "#00f2ff", marginBottom: "1.5rem" }}>
        Coaches Playbook – Dashboard
      </h1>

      {loading && <p>Loading live odds…</p>}
      {error && <p style={{ color: "salmon" }}>{error}</p>}

      <GameSelector
        games={games}
        selectedGameId={selectedGameId}
        onChange={setSelectedGameId}
      />

      {/* GAME SUMMARY */}
      {selectedGame && <GameBreakdown game={selectedGame} />}

      {/* GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "1.5rem",
          marginTop: "2rem",
        }}
      >
        <OddsCard game={selectedGame} />

        <PropsCard
          game={selectedGame}
          propsData={propsData}
          loading={loadingProps}
        />

        <ParlayBuilder game={selectedGame} />

        <LadderGenerator />

        <PlayerSelector />
      </div>
    </div>
  );
}
