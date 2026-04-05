import { interpolate, useCurrentFrame } from "remotion";

export function PulsingDots() {
  const frame = useCurrentFrame();

  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "center" }}>
      {[0, 1, 2].map((i) => {
        const cycle = (frame + i * 8) % 36;
        const opacity = interpolate(cycle, [0, 18, 36], [0.3, 1, 0.3]);

        return (
          <div
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: "white",
              opacity,
            }}
          />
        );
      })}
    </div>
  );
}
