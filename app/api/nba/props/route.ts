import { NextResponse } from "next/server";
import { NBA_ROSTER } from "@/lib/rosters";

interface ApiProp {
  id: string;
  sport: "nba";
  player: string;
  teamFull: string;
  market: string;
  line: number | null;
  odds: number;
  game: string;
  homeTeam: string;
  awayTeam: string;
}

export async function GET(req: Request) {
  try {
    const API = process.env.ODDS_API_KEY;
    if (!API) return NextResponse.json({ error: "Missing key" }, { status: 500 });

    const { searchParams } = new URL(req.url);
    const gameId = searchParams.get("gameId");
    if (!gameId) return NextResponse.json<ApiProp[]>([]);

    const MARKETS =
      "player_points,player_rebounds,player_assists,player_threes";

    const res = await fetch(
      `https://api.the-odds-api.com/v4/sports/basketball_nba/events/${gameId}/odds/?regions=us&markets=${MARKETS}&apiKey=${API}`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("NBA props failed");
    const event = await res.json();

    const home = event.home_team;
    const away = event.away_team;

    const markets = event.bookmakers?.[0]?.markets || [];

    const props: ApiProp[] = [];

    for (const m of markets) {
      for (const o of m.outcomes) {
        const player = o.description;

        let team = NBA_ROSTER[player];

        if (!team) {
          // fallback: home player as safe default
          team = home;
        }

        props.push({
          id: `${event.id}-${m.key}-${player}`,
          sport: "nba",
          player,
          teamFull: team,
          market: m.key,
          line: o.point ?? null,
          odds: o.price,
          game: `${away} @ ${home}`,
          homeTeam: home,
          awayTeam: away,
        });
      }
    }

    return NextResponse.json(props);
  } catch (err) {
    return NextResponse.json<ApiProp[]>([]);
  }
}
