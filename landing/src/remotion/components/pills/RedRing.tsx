export function RedRing() {
  return (
    <div
      style={{
        width: 240,
        height: 80,
        background: "#000",
        borderRadius: 26,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        padding: "10px 20px",
        boxShadow: "0 0 30px rgba(255,59,48,0.15), 0 4px 20px rgba(0,0,0,0.5)",
        border: "2px solid rgba(255,59,48,0.4)",
      }}
    >
      <div style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff443a" }} />
        <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
          {[5, 10, 16, 20, 16, 10, 5].map((h, i) => (
            <div
              key={i}
              style={{
                width: 3,
                height: h,
                borderRadius: 2,
                background: "white",
              }}
            />
          ))}
        </div>
        <span style={{ fontSize: 12, fontWeight: 500, opacity: 0.5, color: "white", fontVariantNumeric: "tabular-nums" }}>
          0:03
        </span>
      </div>
      <div style={{ fontSize: 12, opacity: 0.4, color: "white", width: "100%", textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        Hello, I am testing this app...
      </div>
    </div>
  );
}
