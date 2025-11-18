// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Sidebar from "./components/Sidebar";

export const metadata: Metadata = {
  title: "CoachesPlaybookAI",
  description: "AI-powered NFL & NBA betting assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          background: "#020409",
          color: "#ffffff",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
          }}
        >
          <Sidebar />

          <main
            style={{
              flex: 1,
              padding: "2rem 2.5rem",
              maxWidth: "1300px",
              margin: "0 auto",
            }}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
