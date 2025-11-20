// app/api/ai-picks/route.ts
import { NextResponse } from "next/server";

type Sport = "nfl" | "nba";

interface AIPick {
  id: string;
  sport: Sport;
  gameId?: string;
  player: string;
  market: string;
  line: number;
  overOdds: number;
  modelEdgePct: number;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sport = (searchParams.get("sport") as Sport) || "nfl";
  const gameId = searchParams.get("gameId") || undefined;

  // TODO: replace this block with real model logic later
  const picks: AIPick[] =
    sport === "nfl"
      ? [
          {
            id: "lamb-rec",
            sport,
            gameId,
            player: "CeeDee Lamb",
            market: "receptions",
            line: 5.5,
            overOdds: -145,
            modelEdgePct: 7.2,
          },
          {
            id: "adams-yds",
            sport,
            gameId,
            player: "Davante Adams",
            market: "receiving_yards",
            line: 67.5,
            overOdds: -135,
            modelEdgePct: 5.1,
          },
        ]
      : [
          {
            id: "curry-3pt",
            sport,
            gameId,
            player: "Stephen Curry",
            market: "threes_made",
            line: 3.5,
            overOdds: -150,
            modelEdgePct: 6.4,
          },
          {
            id: "tatum-pts",
            sport,
            gameId,
            player: "Jayson Tatum",
            market: "points",
            line: 24.5,
            overOdds: -140,
            modelEdgePct: 4.3,
          },
        ];

  return NextResponse.json({ sport, gameId, picks });
}
