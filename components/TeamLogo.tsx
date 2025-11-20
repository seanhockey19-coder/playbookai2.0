// components/TeamLogo.tsx
import React from "react";

type Sport = "nfl" | "nba";

interface TeamLogoProps {
  team: string;
  sport: Sport;
  size?: number;
}

/**
 * Simple pill / circle logo with team initials.
 * No extra visible text so it doesn't mess up layout labels.
 */
export default function TeamLogo({ team, sport, size = 24 }: TeamLogoProps) {
  // Derive initials from team name, e.g. "Buffalo Bills" -> "BB", "New York Jets" -> "NY"
  const words = team.split(" ").filter(Boolean);
  let initials = "";

  if (words.length >= 2) {
    initials = (words[0][0] + words[1][0]).toUpperCase();
  } else if (words.length === 1) {
    initials = words[0].slice(0, 2).toUpperCase();
  } else {
    initials = "?";
  }

  return (
    <div
      aria-label={team}
      className="flex items-center justify-center rounded-full bg-slate-800 text-[10px] font-semibold text-slate-100 shrink-0"
      style={{ width: size, height: size }}
    >
      {initials}
    </div>
  );
}
