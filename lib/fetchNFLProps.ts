export async function fetchNFLProps(gameId: string) {
  const API = process.env.ODDS_API_KEY;

  if (!API) return [];

  const url = `https://api.the-odds-api.com/v4/sports/americanfootball_nfl/events/${gameId}/odds/?regions=us&markets=player_pass_yds,player_rush_yds,player_rec_yds,player_receptions,player_anytime_td&oddsFormat=american&apiKey=${API}`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    console.error("Props API error:", await res.text());
    return [];
  }

  const data = await res.json();

  const markets = data.bookmakers?.[0]?.markets || [];

  const props = [];

  for (const m of markets) {
    for (const o of m.outcomes) {
      props.push({
        player: o.description,
        market: m.key,
        line: o.point ?? null,
        odds: o.price,
        gameId,
      });
    }
  }

  return props;
}
