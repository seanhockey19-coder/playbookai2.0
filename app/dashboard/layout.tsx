export const metadata = {
  title: "CoachesPlaybookAI – Dashboard",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "2rem 1rem",
        color: "white",
      }}
    >
      {children}
    </div>
  );
}

    }}>
      <aside style={{
        width: "240px",
        background: "#111",
        padding: "2rem 1rem",
        borderRight: "1px solid #222"
      }}>
        <h2 style={{ color: "#0ff", marginBottom: "2rem" }}>CoachesPlaybookAI</h2>

        <nav>
          <ul style={{ listStyle: "none", padding: 0, lineHeight: "2.2rem" }}>
            <li>🏠 Dashboard</li>
            <li>🏈 Props</li>
            <li>📊 Ladder Challenge</li>
            <li>📁 My Parlays</li>
          </ul>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: "2rem" }}>
        {children}
      </main>
    </div>
  );
}

