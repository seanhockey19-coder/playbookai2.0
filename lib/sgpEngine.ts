// Utility: Convert American odds → implied probability
export const impliedProb = (odds: number): number => {
  if (odds > 0) return 100 / (100 + odds);
  return Math.abs(odds) / (100 + Math.abs(odds));
};

interface SGPCandidate {
  label: string;
  odds: number;
  prob: number;
  value: number;
  category: string;
}

export const generateBestSGP = (game: any) => {
  const candidates: SGPCandidate[] = []; // <-- FIXED TYPING

  const ml = game.h2h?.outcomes || [];
  const spreads = game.spreads?.outcomes || [];
  const totals = game.totals?.outcomes || [];

  ml.forEach((o) => {
    const prob = impliedProb(o.price);
    candidates.push({
      label: `${o.name} ML`,
      odds: o.price,
      prob,
      value: prob * 100,
      category: "moneyline",
    });
  });

  spreads.forEach((o) => {
    const point = o.point ?? 0;
    const prob = impliedProb(o.price);
    candidates.push({
      label: `${o.name} ${point > 0 ? "+" : ""}${point}`,
      odds: o.price,
      prob,
      value: prob * 100,
      category: "spread",
    });
  });

  totals.forEach((o) => {
    const point = o.point ?? 0;
    const prob = impliedProb(o.price);
    candidates.push({
      label: `${o.name} ${point}`,
      odds: o.price,
      prob,
      value: prob * 100,
      category: "total",
    });
  });

  // sort highest value → lowest
  return candidates.sort((a, b) => b.value - a.value);
};


  const sorted = candidates
    .map((c) => ({ ...c, score: c.value + c.prob * 100 }))
    .sort((a, b) => b.score - a.score);

  const top = sorted.slice(0, 5);

  const hasFavorite = top.find((c) => c.category === "moneyline");
  const hasSpread = top.find((c) => c.category === "spread");
  const hasTotal = top.find((c) => c.category === "total");

  const build = [];
  if (hasFavorite) build.push(hasFavorite);
  if (hasSpread && build.length < 2) build.push(hasSpread);
  if (hasTotal && build.length < 3) build.push(hasTotal);

  return build.slice(0, 3);
}

