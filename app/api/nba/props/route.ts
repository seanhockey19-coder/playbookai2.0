// app/api/nba/props/route.ts

import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const API = process.env.ODDS_API_KEY;
    if (!API) return NextResponse.json({ error: "Missing ODDS_API_KEY" }, { status: 500 });

    const { searchParams } = new URL(req.url);
    const gameId = searchParams.get("gameId");

    if (!gameId)
      return NextResponse.json({ error: "Missing gameId" }, { status: 400 });

    const url = `https://api.the-odds-api.com/v4/sports/basketball_nba/events/${gameId}/odds/?regions=us&markets=player_points,player_assists,player_rebounds,player_threes&oddsFormat=american&apiKey=${API}`;

    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok)
      return NextResponse.json({ error: `Odds API error: ${res.status}` }, { status: 500 });

    const data = await res.json();

    const markets = data.bookmakers?.[0]?.markets || [];
    const props: any[] = [];

    for (const m of markets) {
      for (const o of m.outcomes) {
        props.push({
          id: `${data.id}-${m.key}-${o.description}`,
          sport: "nba",
          player: o.description,
          team: "",
          market: m.key,
          line: o.point ?? null,
          odds: o.price,
          edge: 0,
          game: `${data.home_team} vs ${data.away_team}`,
        });
      }
    }

    return NextResponse.json(props);
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
