import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FullIsland } from "./components/pills/FullIsland";
import { SlimDropdown } from "./components/pills/SlimDropdown";
import { RedRing } from "./components/pills/RedRing";
import { PureMinimal } from "./components/pills/PureMinimal";

const DESIGNS = [
  { component: FullIsland, label: "Full Island", desc: "Large blob with red dot, timer, and transcript inside" },
  { component: SlimDropdown, label: "Slim + Dropdown", desc: "Compact pill with separate transcript panel" },
  { component: RedRing, label: "Red Ring", desc: "Pulsing red border, cinematic feel" },
  { component: PureMinimal, label: "Pure Minimal", desc: "Just waveform and text. Maximum zen." },
];

const HOLD_FRAMES = 60; // 2s per design

export function DesignIteration() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const TRANSITION = 15;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a", justifyContent: "center", alignItems: "center" }}>
      {DESIGNS.map((design, i) => {
        const start = i * HOLD_FRAMES;
        const end = start + HOLD_FRAMES;

        const enterOpacity = interpolate(frame, [start, start + TRANSITION], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const exitOpacity =
          i < DESIGNS.length - 1
            ? interpolate(frame, [end - TRANSITION, end], [1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
            : 1;

        const opacity = Math.min(enterOpacity, exitOpacity);

        const labelSpring = spring({
          fps,
          frame: frame - start - 5,
          config: { damping: 20, stiffness: 100 },
          durationInFrames: 20,
        });

        const isLast = i === DESIGNS.length - 1;
        const Pill = design.component;

        return (
          <AbsoluteFill
            key={i}
            style={{ opacity, justifyContent: "center", alignItems: "center" }}
          >
            <div style={{ position: "relative" }}>
              {isLast && frame > start + 10 && (
                <div
                  style={{
                    position: "absolute",
                    inset: -6,
                    borderRadius: 30,
                    border: "1px solid rgba(255,107,107,0.3)",
                    boxShadow: "0 0 20px rgba(255,107,107,0.1)",
                    opacity: interpolate(frame, [start + 10, start + 25], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }),
                  }}
                />
              )}
              <Pill />
            </div>
            <div
              style={{
                marginTop: 28,
                textAlign: "center",
                opacity: labelSpring,
                transform: `translateY(${(1 - labelSpring) * 10}px)`,
              }}
            >
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: isLast ? "#ff6b6b" : "white",
                  letterSpacing: 1,
                }}
              >
                {isLast ? "✓ " : ""}
                {design.label}
              </div>
              <div style={{ fontSize: 13, color: "white", opacity: 0.4, marginTop: 4 }}>
                {design.desc}
              </div>
            </div>
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
}
