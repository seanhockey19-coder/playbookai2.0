import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "CoachesPlaybookAI",
  description: "NFL / NBA prop and ladder tools",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100">
        <div className="min-h-screen flex">

          {/* Sidebar (hidden on mobile, fixed on desktop) */}
          <Sidebar />

          {/* Main Content Area */}
          <main className="flex-1 min-h-screen md:ml-64 overflow-y-auto px-4 sm:px-6 py-6">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>

        </div>
      </body>
    </html>
  );
}
