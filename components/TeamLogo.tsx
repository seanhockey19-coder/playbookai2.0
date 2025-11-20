import Image from "next/image";
import { NFL_LOGOS, NBA_LOGOS } from "@/lib/teamLogos";

export default function TeamLogo({
  team,
  sport,
  size = 20,
}: {
  team: string;
  sport: "nfl" | "nba";
  size?: number;
}) {
  const src = sport === "nfl" ? NFL_LOGOS[team] : NBA_LOGOS[team];

  if (!src) {
    return (
      <div
        style={{
          width: size,
          height: size,
          background: "rgba(255,255,255,0.08)",
          borderRadius: "50%",
        }}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={`${team} logo`}
      width={size}
      height={size}
      className="rounded-full"
    />
  );
}
