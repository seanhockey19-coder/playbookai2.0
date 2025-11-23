// app/api/ladder/[week]/route.ts
import { NextRequest } from "next/server";
import {
  getCurrentTimeframe,
  getPlayerGameStatsByPlayer,
  getTeamGameStatsByWeek,
  type PlayerGame,
} from "@/lib/sportsdata";
import {
  buildRecentStats,
  buildMatchupContext,
  projectPlayerYards,
  suggestLadderLeg,
  type MarketType,
} from "@/lib/statsEngine";

/**
 * Configure which players you want the ladder engine to consider.
 * These MUST be real SportsData.io PlayerIDs + team/opp abbreviations.
 * Once this is wired, everything else is REAL – no mock data.
 */
const LADDER_CANDIDATES: {
  playerId: number;
  name: string;
  team: string;
  opponent: string;
  market: MarketType;
  safeLine: number;
}[] = [
  // Example: you’ll replace these IDs with the actual IDs for Barkley, Diggs, etc.
  // { playerId: 12345, name: "Saquon Barkley", team: "NYG", opponent: "DET", market: "rushing", safeLine: 30 },
  // { playerId: 23456, name: "Stefon Diggs", team: "BUF", opponent: "NE", market: "receiving", safeLine: 30 },
];

export async function GET(
  req: NextRequest,
  { params }: { params: { week: string } }
) {
  try {
    const weekParam = params.week;

    let season: number;
    let week: number;

    if (weekParam === "current") {
      // Use SportsData.io timeframes to figure out current season/week
      const timeframes = await getCurrentTimeframe();
      const current = timeframes.find((t) => t.Type === "Current");
      if (!current) throw new Error("No current timeframe from SportsData.io");

      season = current.Season;
      week = current.Week;
    } else {
      // e.g. /api/ladder/12 for Week 12 of current season
      const timeframes = await getCurrentTimeframe();
      const current = timeframes.find((t) => t.Type === "Current");
      if (!current) throw new Error("No current timeframe from SportsData.io");
      season = current.Season;
      week = parseInt(weekParam, 10);
    }

    const teamGames = await getTeamGameStatsByWeek(season, week);

    const legs = [];

    for (const c of LADDER_CANDIDATES) {
      const playerGames: PlayerGame[] = await getPlayerGameStatsByPlayer(
        season,
        c.playerId
      );

      // Filter down to games this season only (API may return multiple seasons)
      const gamesThisSeason = playerGames.filter((g) => g.Season === season);

      if (!gamesThisSeason.length) continue;

      const recent = buildRecentStats(gamesThisSeason, c.market, 5);
      if (recent.avgYards === 0 && recent.avgVolume === 0) continue;

      const matchup = buildMatchupContext(teamGames, c.opponent, c.market);
      const projection = projectPlayerYards(recent, matchup);

      const leg = suggestLadderLeg(
        c.playerId,
        c.name,
        c.team,
        c.opponent,
        c.market,
        projection,
        c.safeLine
      );

      legs.push(leg);
    }

    // sort by AI confidence, pick top 4–5
    legs.sort((a, b) => b.aiConfidence - a.aiConfidence);
    const ladder = legs.slice(0, 5);

    return new Response(JSON.stringify({ season, week, ladder }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Ladder generation error", err);
    return new Response(
      JSON.stringify({ error: "Failed to build ladder", details: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
