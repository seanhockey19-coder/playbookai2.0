// app/game-breakdown/page.tsx
export default function GameBreakdownPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-50">
          Game Breakdown
        </h1>
        <p className="text-sm text-slate-400">
          Deep dive into pace, pass rate, scoring expectations and script for
          each matchup.
        </p>
      </header>

      <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 md:p-5 space-y-4">
        <p className="text-xs text-slate-400">
          For now this is a static layout. We&apos;ll later reuse the same game
          selector from the Dashboard and plug in per-game advanced stats here.
        </p>
      </section>
    </div>
  );
}
