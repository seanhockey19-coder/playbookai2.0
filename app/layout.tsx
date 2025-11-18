// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "CoachesPlaybookAI",
  description: "NFL / NBA prop and ladder tools",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100">
        <div className="min-h-screen flex">
          {/* LEFT NAV */}
          <Sidebar />

          {/* MAIN CONTENT */}
          <main className="flex-1 min-h-screen overflow-y-auto px-6 py-6">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
