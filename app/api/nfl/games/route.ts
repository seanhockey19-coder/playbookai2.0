// app/api/nfl/games/route.ts

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const API = process.env.ODDS_API_KEY;
    if (!API) return NextResponse.json({ error: "Missing ODDS_API_KEY" }, { status: 500 });

    const url = `https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds/?regions=us&markets=h2h,spreads,totals&oddsFormat=american&apiKey=${API}`;

    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok)
      return NextResponse.json({ error: `Odds API error: ${res.status}` }, { status: 500 });

    const games = await res.json();

    const formatted = games.map((g: any) => ({
      id: g.id,
      homeTeam: g.home_team,
      awayTeam: g.away_team,
      commence: g.commence_time,
      markets: g.bookmakers?.[0]?.markets || [],
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
