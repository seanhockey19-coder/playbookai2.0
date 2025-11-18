"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const menuItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "AI Picks", href: "/picks" },
  { name: "Ladder Challenge", href: "/ladder" },
  { name: "Game Breakdown", href: "/breakdown" },
  { name: "Player Props", href: "/props" },
];

export default function Sidebar() {
  const pathname = usePathname() || ""; // ✅ Prevents null issues
  const [open, setOpen] = useState(false);

  return (
    <aside
      style={{
        width: "240px",
        height: "100vh",
        background: "#0a0f1a",
        borderRight: "1px solid #111a2b",
        padding: "1rem",
        position: "fixed",
        left: 0,
        top: 0,
      }}
    >
      <h2
        style={{
          fontSize: "1.4rem",
          marginBottom: "1.5rem",
          color: "#00f2ff",
          fontWeight: 700,
        }}
      >
        Coaches PlaybookAI
      </h2>

      <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                background: isActive ? "#00f2ff22" : "transparent",
                border: isActive ? "1px solid #00f2ff66" : "1px solid transparent",
                color: isActive ? "#00f2ff" : "#d6e2ff",
                fontWeight: isActive ? 700 : 400,
                transition: "0.2s",
              }}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
