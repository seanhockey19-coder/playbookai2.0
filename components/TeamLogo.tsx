// components/TeamLogo.tsx
import React from "react";

type Sport = "nfl" | "nba";

interface TeamLogoProps {
  team: string;
  sport: Sport;
  size?: number;
}

/**
 * Clean circle logo with two-letter team initials.
 * No extra text, no truncation bugs, no wrapping issues.
 */
export default function TeamLogo({ team, sport, size = 26 }: TeamLogoProps) {
  if (!team || typeof team !== "string") {
    return (
      <div
        className="flex items-center justify-center rounded-full bg-slate-800 text-[10px] font-semibold text-slate-100"
        style={{ width: size, height: size }}
      >
        ?
      </div>
    );
  }

  // Split team name: e.g., "Buffalo Bills" → ["Buffalo", "Bills"]
  const words = team.trim().split(/\s+/);

  // Always create EXACTLY 2 letters for consistency
  let initials = "";

  if (words.length >= 2) {
    // First letter of first 2 words
    initials = (words[0][0] + words[1][0]).toUpperCase();
  } else {
    // One-word teams (rare in NFL/NBA but covered)
    initials = words[0].slice(0, 2).toUpperCase();
  }

  // Fallback safety: ensure exactly 2 chars
  if (initials.length === 1) initials = initials + initials;
  if (initials.length > 2) initials = initials.slice(0, 2);

  return (
    <div
      aria-label={team}
      className="flex items-center justify-center rounded-full bg-slate-800 text-[11px] font-semibold text-slate-100 uppercase shrink-0"
      style={{
        width: size,
        height: size,
        lineHeight: "1",
      }}
    >
      {initials}
    </div>
  );
}
