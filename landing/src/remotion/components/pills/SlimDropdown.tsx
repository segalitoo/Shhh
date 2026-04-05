export function SlimDropdown() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div
        style={{
          width: 180,
          height: 44,
          background: "#000",
          borderRadius: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          boxShadow: "0 4px 24px rgba(0,0,0,0.6)",
        }}
      >
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#ff453a" }} />
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
        <span style={{ fontSize: 11, fontWeight: 500, opacity: 0.5, color: "white", fontVariantNumeric: "tabular-nums" }}>
          0:03
        </span>
      </div>
      <div
        style={{
          background: "#000",
          borderRadius: 14,
          padding: "10px 16px",
          fontSize: 12,
          color: "white",
          opacity: 0.4,
          minWidth: 200,
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        }}
      >
        Hello, I am testing this...
      </div>
    </div>
  );
}
