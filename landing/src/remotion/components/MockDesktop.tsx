import type { ReactNode } from "react";

export function MockDesktop({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(180deg, #2a2a3a 0%, #1e1e2e 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: 26,
          background: "rgba(0,0,0,0.4)",
          display: "flex",
          alignItems: "center",
          padding: "0 12px",
          fontSize: 11,
          color: "white",
          opacity: 0.5,
          gap: 16,
        }}
      >
        <span style={{ fontWeight: 700 }}></span>
        <span>Finder</span>
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
      </div>
      {children}
    </div>
  );
}
