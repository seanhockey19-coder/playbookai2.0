import { NextResponse } from "next/server";
import { NFL_ROSTER } from "@/lib/rosters";

interface ApiProp {
  id: string;
  sport: "nfl";
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
      "player_pass_yds,player_rush_yds,player_rec_yds,player_receptions,player_anytime_td";

    const res = await fetch(
      `https://api.the-odds-api.com/v4/sports/americanfootball_nfl/events/${gameId}/odds/?regions=us&markets=${MARKETS}&apiKey=${API}`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("NFL props failed");
    const event = await res.json();

    const home = event.home_team;
    const away = event.away_team;

    const markets = event.bookmakers?.[0]?.markets || [];

    const props: ApiProp[] = [];

    for (const m of markets) {
      for (const o of m.outcomes) {
        const player = o.description;

        // TEAM MAPPING ⬇⬇⬇
        let team = NFL_ROSTER[player];

        if (!team) {
          // fallback: if QB props
          if (m.key.includes("pass") && player.toLowerCase().includes("qb")) {
            team = home; // best fallback
          } else {
            // fallback: guess based on roster missing
            team = home; // neutral fallback
          }
        }

        props.push({
          id: `${event.id}-${m.key}-${player}`,
          sport: "nfl",
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
