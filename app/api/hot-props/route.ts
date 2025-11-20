import { NextResponse } from "next/server";

const API = process.env.ODDS_API_KEY;

// Convert American odds → implied probability
function impliedProb(odds: number): number {
  if (odds < 0) return Math.abs(odds) / (Math.abs(odds) + 100);
  return 100 / (odds + 100);
}

export async function GET() {
  if (!API) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

  const sports = [
    { key: "nfl", path: "americanfootball_nfl" },
    { key: "nba", path: "basketball_nba" },
  ];

  let results: any[] = [];

  for (const s of sports) {
    const gamesRes = await fetch(
      `https://api.the-odds-api.com/v4/sports/${s.path}/odds/?regions=us&markets=h2h&apiKey=${API}`,
      { cache: "no-store" }
    );

    if (!gamesRes.ok) continue;
    const games = await gamesRes.json();

    for (const g of games) {
      const propsRes = await fetch(
        `https://api.the-odds-api.com/v4/sports/${s.path}/events/${g.id}/odds/?regions=us&markets=player_pass_yds,player_rush_yds,player_rec_yds,player_points,player_assists,player_rebounds,player_threes,player_anytime_td&apiKey=${API}`,
        { cache: "no-store" }
      );

      if (!propsRes.ok) continue;
      const event = await propsRes.json();
      const markets = event.bookmakers?.[0]?.markets || [];

      for (const m of markets) {
        for (const o of m.outcomes) {
          const prob = impliedProb(o.price);

          // Fake form score until stats integration (Phase 3)
          const formScore = Math.random() * 0.25 + 0.45; // 45%–70%

          const edge = formScore - prob;

          results.push({
            id: `${event.id}-${m.key}-${o.description}`,
            sport: s.key,
            game: `${event.home_team} @ ${event.away_team}`,
            player: o.description,
            market: m.key,
            line: o.point ?? null,
            odds: o.price,
            implied: prob,
            expected: formScore,
            edge,
            score: edge * 100,
          });
        }
      }
    }
  }

  // Sort best → worst
  results.sort((a, b) => b.score - a.score);

  return NextResponse.json(results.slice(0, 50));
}
