{/* Game breakdown */}
<section style={cardBase}>
  <div style={subtleLabel}>Game Breakdown</div>

  {!selectedGame ? (
    <div style={{ fontSize: "0.9rem", opacity: 0.7 }}>
      Select a game above to see the breakdown.
    </div>
  ) : (
    <>
      {/* Header Teams */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.25rem",
        }}
      >
        ...
        (entire new breakdown code you received)
        ...
      </div>
    </>
  )}
</section>
