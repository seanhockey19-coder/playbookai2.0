// app/player-props/page.tsx
export default function PlayerPropsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-50">
          Player Props
        </h1>
        <p className="text-sm text-slate-400">
          Browse and filter all props for a slate. Perfect for building
          same-game parlays or our ladder legs.
        </p>
      </header>

      <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 md:p-5 space-y-4">
        {/* Filters row */}
        <div className="grid gap-3 md:grid-cols-4 text-xs">
          <select className="rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-slate-100">
            <option>All games</option>
          </select>
          <select className="rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-slate-100">
            <option>All markets</option>
            <option>Passing yards</option>
            <option>Rushing yards</option>
            <option>Receiving yards</option>
            <option>Receptions</option>
          </select>
          <select className="rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-slate-100">
            <option>All odds</option>
            <option>-1000 to -500</option>
            <option>-500 to -200</option>
            <option>-200 to +200</option>
          </select>
          <input
            className="rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-slate-100"
            placeholder="Search player…"
          />
        </div>

        {/* Table placeholder */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs md:text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800">
                <th className="py-2 text-left font-normal">Player</th>
                <th className="py-2 text-left font-normal">Team</th>
                <th className="py-2 text-left font-normal">Market</th>
                <th className="py-2 text-left font-normal">Line</th>
                <th className="py-2 text-left font-normal">Odds</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr>
                <td className="py-2 text-slate-100">Sample Player</td>
                <td className="py-2">DAL</td>
                <td className="py-2">Receiving yards</td>
                <td className="py-2">o59.5</td>
                <td className="py-2">-130</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-slate-500">
          When the odds API is fully wired, this table will load live props from{" "}
          <code className="bg-slate-800 px-1 py-[1px] rounded text-[10px]">
            /api/props
          </code>
          .
        </p>
      </section>
    </div>
  );
}
