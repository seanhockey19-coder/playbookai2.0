import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const API = process.env.ODDS_API_KEY;
    if (!API) return NextResponse.json({ error: "Missing key" }, { status: 500 });

    const { searchParams } = new URL(req.url);
    const gameId = searchParams.get("gameId");
    if (!gameId) return NextResponse.json([]);

    const MARKETS =
      "player_pass_yds,player_rush_yds,player_rec_yds,player_receptions,player_anytime_td";

    const res = await fetch(
      `https://api.the-odds-api.com/v4/sports/americanfootball_nfl/events/${gameId}/odds/?regions=us&markets=${MARKETS}&apiKey=${API}`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("NFL props failed");
    const event = await res.json();

    const markets = event.bookmakers?.[0]?.markets || [];

    const props = [];

    for (const m of markets) {
      for (const o of m.outcomes) {
        props.push({
          id: `${event.id}-${m.key}-${o.description}`,
          sport: "nfl",
          player: o.description,
          team: "", // Odds API doesn't send team directly
          market: m.key,
          line: o.point ?? null,
          odds: o.price,
          game: `${event.away_team} @ ${event.home_team}`,
        });
      }
    }

    return NextResponse.json(props);
  } catch (err) {
    return NextResponse.json([]);
  }
}
