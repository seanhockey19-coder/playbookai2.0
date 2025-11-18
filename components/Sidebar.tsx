// components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/" },
  { label: "AI Picks", href: "/ai-picks" },
  { label: "Ladder Challenge", href: "/ladder-challenge" },
  { label: "Game Breakdown", href: "/game-breakdown" },
  { label: "Player Props", href: "/player-props" },
];

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isActive =
    item.href === "/"
      ? pathname === "/"
      : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      className={`block rounded-lg px-4 py-2 text-sm font-medium transition
        ${isActive
          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/60"
          : "text-slate-200/80 hover:bg-slate-800 hover:text-slate-50"}
      `}
    >
      {item.label}
    </Link>
  );
}

export function Sidebar(): ReactNode {
  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-slate-950 border-r border-slate-800/80">
      <div className="px-5 pt-6 pb-4 border-b border-slate-800/70">
        <div className="text-xs font-semibold tracking-wide text-cyan-400">
          Coaches
        </div>
        <div className="text-lg font-bold tracking-tight text-slate-50">
          PlaybookAI
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-slate-800/70 text-[11px] text-slate-500">
        Alpha build • internal use only
      </div>
    </aside>
  );
}
