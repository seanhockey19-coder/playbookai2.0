// components/TeamLogo.tsx
import Image from "next/image";

type Sport = "nfl" | "nba";

interface TeamLogoProps {
  team: string;    // Full team name e.g. "Buffalo Bills"
  sport: Sport;    // "nfl" or "nba"
  size?: number;
}

// TEAM → ESPN TEAM ID MAPPING
const NFL_TEAM_IDS: Record<string, number> = {
  "Arizona Cardinals": 22,
  "Atlanta Falcons": 1,
  "Baltimore Ravens": 33,
  "Buffalo Bills": 2,
  "Carolina Panthers": 29,
  "Chicago Bears": 3,
  "Cincinnati Bengals": 4,
  "Cleveland Browns": 5,
  "Dallas Cowboys": 6,
  "Denver Broncos": 7,
  "Detroit Lions": 8,
  "Green Bay Packers": 9,
  "Houston Texans": 34,
  "Indianapolis Colts": 11,
  "Jacksonville Jaguars": 30,
  "Kansas City Chiefs": 12,
  "Las Vegas Raiders": 13,
  "Los Angeles Chargers": 24,
  "Los Angeles Rams": 14,
  "Miami Dolphins": 15,
  "Minnesota Vikings": 16,
  "New England Patriots": 17,
  "New Orleans Saints": 18,
  "New York Giants": 19,
  "New York Jets": 20,
  "Philadelphia Eagles": 21,
  "Pittsburgh Steelers": 23,
  "San Francisco 49ers": 25,
  "Seattle Seahawks": 26,
  "Tampa Bay Buccaneers": 27,
  "Tennessee Titans": 10,
  "Washington Commanders": 28,
};

const NBA_TEAM_IDS: Record<string, number> = {
  "Atlanta Hawks": 1,
  "Boston Celtics": 2,
  "Brooklyn Nets": 17,
  "Charlotte Hornets": 30,
  "Chicago Bulls": 4,
  "Cleveland Cavaliers": 5,
  "Dallas Mavericks": 6,
  "Denver Nuggets": 7,
  "Detroit Pistons": 8,
  "Golden State Warriors": 9,
  "Houston Rockets": 10,
  "Indiana Pacers": 11,
  "LA Clippers": 12,
  "Los Angeles Lakers": 13,
  "Memphis Grizzlies": 29,
  "Miami Heat": 14,
  "Milwaukee Bucks": 15,
  "Minnesota Timberwolves": 16,
  "New Orleans Pelicans": 3,
  "New York Knicks": 18,
  "Oklahoma City Thunder": 25,
  "Orlando Magic": 19,
  "Philadelphia 76ers": 20,
  "Phoenix Suns": 21,
  "Portland Trail Blazers": 22,
  "Sacramento Kings": 23,
  "San Antonio Spurs": 24,
  "Toronto Raptors": 28,
  "Utah Jazz": 26,
  "Washington Wizards": 27,
};

export default function TeamLogo({ team, sport, size = 28 }: TeamLogoProps) {
  const teamMap = sport === "nfl" ? NFL_TEAM_IDS : NBA_TEAM_IDS;

  const id = teamMap[team];

  if (!id) {
    // fallback bubble if unknown team name (never should happen)
    return (
      <div
        className="flex items-center justify-center rounded-full bg-slate-800 text-[10px]"
        style={{ width: size, height: size }}
      >
        ?
      </div>
    );
  }

  // ESPN CDN URL
  const url =
    sport === "nfl"
      ? `https://a.espncdn.com/i/teamlogos/nfl/500/${id}.png`
      : `https://a.espncdn.com/i/teamlogos/nba/500/${id}.png`;

  return (
    <Image
      src={url}
      alt={team}
      width={size}
      height={size}
      className="rounded-full bg-slate-900 p-[2px]"
    />
  );
}
