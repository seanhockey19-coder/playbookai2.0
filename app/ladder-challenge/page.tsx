// app/ladder-challenge/page.tsx
export default function LadderChallengePage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-50">
          Ladder Challenge
        </h1>
        <p className="text-sm text-slate-400">
          Build and track your 10-day bank-builder using our low-risk prop
          combos.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-3 lg:gap-6">
        {/* Current step */}
        <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-2xl p-4 md:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-200">
              Today&apos;s Ladder
            </h2>
            <span className="text-[11px] text-cyan-400">
              Target odds: ~ -100
            </span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3 space-y-2 text-sm">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Day</span>
              <span>Stake → Target</span>
            </div>
            <div className="flex justify-between text-sm text-slate-100">
              <span>Day 2</span>
              <span>$20 → $40</span>
            </div>
          </div>

          <div className="text-xs text-slate-400">
            This is just layout for now. We&apos;ll wire this up to the AI
            engine so it automatically fills with -500 to -1000 legs that land
            around -100 overall.
          </div>
        </div>

        {/* History / notes */}
        <div className="space-y-3">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 md:p-5">
            <h2 className="text-sm font-semibold text-slate-200 mb-2">
              Ladder History
            </h2>
            <p className="text-xs text-slate-400">
              Once we wire this to storage, you&apos;ll see every past ladder
              attempt, hit rate by day, and total profit.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 md:p-5">
            <h2 className="text-sm font-semibold text-slate-200 mb-2">
              Rules
            </h2>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• 4–6 legs per day.</li>
              <li>• Each leg −500 to −1000 range.</li>
              <li>• Parlays should land around −100 total.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
