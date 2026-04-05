import { useCurrentFrame } from "remotion";

const BAR_COUNT = 9;
const GRADIENT_START = "#ff6b6b";
const GRADIENT_END = "#ee5a24";

export function WaveformBars({ height = 22 }: { height?: number }) {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        height,
      }}
    >
      {Array.from({ length: BAR_COUNT }).map((_, i) => {
        const phase = (i / BAR_COUNT) * Math.PI * 2;
        const wave = Math.sin(frame * 0.15 + phase);
        const scaleY = 0.3 + 0.7 * ((wave + 1) / 2);

        return (
          <div
            key={i}
            style={{
              width: 3.5,
              height: height * 0.9,
              borderRadius: 2,
              background: `linear-gradient(180deg, ${GRADIENT_START}, ${GRADIENT_END})`,
              transform: `scaleY(${scaleY})`,
              transformOrigin: "center",
            }}
          />
        );
      })}
    </div>
  );
}
