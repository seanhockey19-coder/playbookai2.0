// app/dashboard/layout.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navBase =
  "flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors";
const navActive = `${navBase} bg-sky-600 text-white`;
const navIdle = `${navBase} text-slate-200 hover:bg-slate-800`;

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "AI Picks", href: "/dashboard/ai-picks" },
  { label: "Ladder Challenge", href: "/dashboard/ladder-challenge" },
  { label: "Game Breakdown", href: "/dashboard/game-breakdown" },
  { label: "Player Props", href: "/dashboard/player-props" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/dashboard"; // <-- fixes "possibly null"

  const getClass = (href: string) =>
    pathname === href || pathname.startsWith(href + "/")
      ? navActive
      : navIdle;

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-50">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-950/80 backdrop-blur-sm flex flex-col">
        <div className="px-4 py-6">
          <div className="text-xs uppercase tracking-widest text-slate-400">
            Coaches
          </div>
          <div className="text-lg font-semibold">PlaybookAI</div>
        </div>

        <nav className="flex-1 space-y-1 px-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={getClass(item.href)}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-4 py-3 text-xs text-slate-500 border-t border-slate-800">
          Alpha build · internal use only
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-6xl mx-auto px-4 py-6">{children}</div>
      </main>
    </div>
  );
}
