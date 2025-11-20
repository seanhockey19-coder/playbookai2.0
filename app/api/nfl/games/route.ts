import { NextResponse } from "next/server";

export async function GET() {
  try {
    const API = process.env.ODDS_API_KEY;
    if (!API) {
      return NextResponse.json({ error: "Missing API key" }, { status: 500 });
    }

    const res = await fetch(
      `https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds/?regions=us&markets=h2h&apiKey=${API}`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("NFL API failed");

    const data = await res.json();

    const games = data.map((event: any) => ({
      id: event.id,
      homeTeam: event.home_team,
      awayTeam: event.away_team,
      commence: event.commence_time,
      markets: event.bookmakers?.[0]?.markets || [],
    }));

    return NextResponse.json(games);
  } catch (e) {
    return NextResponse.json([], { status: 200 });
  }
}
