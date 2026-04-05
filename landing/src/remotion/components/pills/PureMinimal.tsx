export function PureMinimal() {
  return (
    <div
      style={{
        width: 220,
        height: 72,
        background: "rgba(0,0,0,0.95)",
        borderRadius: 24,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "10px 20px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.35)",
      }}
    >
      <div style={{ display: "flex", gap: 3, alignItems: "center", height: 22 }}>
        {[5, 10, 15, 20, 22, 20, 15, 10, 5].map((h, i) => (
          <div
            key={i}
            style={{
              width: 3.5,
              height: h,
              borderRadius: 2,
              background: "linear-gradient(180deg, #ff6b6b, #ee5a24)",
            }}
          />
        ))}
      </div>
      <div style={{ fontSize: 12, fontWeight: 500, color: "white", opacity: 0.5, textAlign: "center", width: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        Hello, I am testing this app...
      </div>
    </div>
  );
}
