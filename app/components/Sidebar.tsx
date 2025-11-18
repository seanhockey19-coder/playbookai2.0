// app/components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/ai-picks", label: "Coaches AI Picks", icon: "📋" },
  { href: "/props", label: "Props", icon: "🎯" },
  { href: "/ladder", label: "Ladder Challenge", icon: "🧗" },
  { href: "/parlays", label: "My Parlays", icon: "🧮" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: "240px",
        background: "#05070f",
        borderRight: "1px solid #161921",
        padding: "1.5rem 1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
      }}
    >
      {/* Brand */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            marginBottom: "0.3rem",
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: "999px",
              background:
                "radial-gradient(circle at 30% 30%, #00f2ff, #007a9c)",
            }}
          />
          <span
            style={{
              fontWeight: 700,
              fontSize: "1.1rem",
              letterSpacing: "0.03em",
            }}
          >
            CoachesPlaybookAI
          </span>
        </div>
        <div style={{ fontSize: "0.8rem", color: "#7a859d" }}>
          AI Game Scripts & Picks
        </div>
      </div>

      {/* Nav */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  padding: "0.55rem 0.75rem",
                  borderRadius: "0.6rem",
                  background: active ? "#07111b" : "transparent",
                  border: active ? "1px solid #00f2ff" : "1px solid transparent",
                  color: active ? "#00f2ff" : "#c4ccdd",
                  cursor: "pointer",
                  fontSize: "0.95rem",
                }}
              >
                <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div style={{ flex: 1 }} />

      {/* Footer */}
      <div style={{ fontSize: "0.75rem", color: "#606b84" }}>
        Alpha build • {new Date().getFullYear()}
      </div>
    </aside>
  );
}
