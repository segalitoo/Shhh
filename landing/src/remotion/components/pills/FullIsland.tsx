export function FullIsland() {
  return (
    <div
      style={{
        width: 260,
        height: 86,
        background: "#000",
        borderRadius: 28,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        padding: "12px 20px",
        boxShadow: "0 2px 16px rgba(0,0,0,0.5)",
      }}
    >
      <div style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff453a" }} />
        <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
          {[5, 10, 16, 20, 16, 10, 5].map((h, i) => (
            <div
              key={i}
              style={{
                width: 3,
                height: h,
                borderRadius: 2,
                background: "linear-gradient(180deg, #ff6b6b, #ee5a24)",
              }}
            />
          ))}
        </div>
        <span style={{ fontSize: 12, fontWeight: 500, opacity: 0.6, fontVariantNumeric: "tabular-nums", color: "white" }}>
          0:03
        </span>
      </div>
      <div style={{ fontSize: 12, opacity: 0.45, color: "white", width: "100%", textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        Hello, I am testing this app...
      </div>
    </div>
  );
}
