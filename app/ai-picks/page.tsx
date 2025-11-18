// app/ai-picks/page.tsx
export default function AIPicksPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-50">
          AI Picks
        </h1>
        <p className="text-sm text-slate-400">
          Full card of AI-generated edges across props, totals, and spreads.
        </p>
      </header>

      <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 md:p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-200">
            Top Edges (sample data)
          </h2>
          <span className="text-[11px] text-slate-500">
            Will be fed by /api/ai-picks
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-xs md:text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800">
                <th className="py-2 text-left font-normal">Player</th>
                <th className="py-2 text-left font-normal">Market</th>
                <th className="py-2 text-left font-normal">Line</th>
                <th className="py-2 text-left font-normal">Book Odds</th>
                <th className="py-2 text-left font-normal">Model Edge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr>
                <td className="py-2 text-slate-100">CeeDee Lamb</td>
                <td className="py-2">Receptions</td>
                <td className="py-2">o6.5</td>
                <td className="py-2">-135</td>
                <td className="py-2 text-cyan-300">+7.2%</td>
              </tr>
              <tr>
                <td className="py-2 text-slate-100">Davante Adams</td>
                <td className="py-2">Receiving yards</td>
                <td className="py-2">o74.5</td>
                <td className="py-2">-120</td>
                <td className="py-2 text-cyan-300">+5.4%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-[11px] text-slate-500">
          Once the backend is wired, this table will call{" "}
          <code className="bg-slate-800 px-1 py-[1px] rounded text-[10px]">
            /api/ai-picks
          </code>{" "}
          and show live props from the odds feed.
        </p>
      </section>
    </div>
  );
}
