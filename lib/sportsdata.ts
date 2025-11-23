// lib/sportsdata.ts
const BASE_URL = "https://api.sportsdata.io/v3/nfl/stats/json";

const API_KEY = process.env.SPORTSDATA_API_KEY;

if (!API_KEY) {
  console.warn("SPORTSDATA_API_KEY is not set");
}

async function sdFetch<T>(path: string): Promise<T> {
  const url = `${BASE_URL}${path}?key=${API_KEY}`;

  const res = await fetch(url, { next: { revalidate: 60 } }); // Next.js caching
  if (!res.ok) {
    console.error("SportsData.io error", res.status, url);
    throw new Error(`SportsData.io error: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// Types are simplified; you can refine from SportsData.io docs
export interface PlayerGame {
  GameKey: string;
  Season: number;
  SeasonType: number;
  Week: number;
  Team: string;
  Opponent: string;
  PlayerID: number;
  Name: string;
  Position: string;
  RushingAttempts?: number;
  RushingYards?: number;
  ReceivingTargets?: number;
  ReceivingYards?: number;
  PassingAttempts?: number;
  PassingYards?: number;
  // ... add fields as needed
}

export async function getPlayerGamesBySeason(
  season: number,
  playerId: number
): Promise<PlayerGame[]> {
  // Check docs for exact endpoint; adjust path if needed
  const path = `/PlayerGameStatsByPlayerID/${season}/${playerId}`;
  return sdFetch<PlayerGame[]>(path);
}

export interface TeamGame {
  Season: number;
  Week: number;
  Team: string;
  Opponent: string;
  RushingYards?: number;
  PassingYards?: number;
  // etc.
}

export async function getTeamGamesByWeek(
  season: number,
  week: number
): Promise<TeamGame[]> {
  const path = `/TeamGameStatsByWeek/${season}/${week}`;
  return sdFetch<TeamGame[]>(path);
}
