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

const HOLD_FRAMES = 120; // 4s per design
const TRANSITION = 20;
export function DesignIteration() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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
          frame: frame - start - 8,
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
            <div style={{ position: "relative", transform: "scale(2.6)" }}>
              {isLast && frame > start + 15 && (
                <div
                  style={{
                    position: "absolute",
                    inset: -6,
                    borderRadius: 30,
                    border: "1px solid rgba(255,107,107,0.3)",
                    boxShadow: "0 0 20px rgba(255,107,107,0.1)",
                    opacity: interpolate(frame, [start + 15, start + 35], [0, 1], {
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
                position: "absolute",
                bottom: 40,
                left: 0,
                right: 0,
                textAlign: "center",
                opacity: labelSpring,
                transform: `translateY(${(1 - labelSpring) * 10}px)`,
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 600,
                  color: isLast ? "#ff6b6b" : "white",
                  letterSpacing: 1,
                }}
              >
                {isLast ? "✓ " : ""}
                {design.label}
              </div>
              <div style={{ fontSize: 20, color: "white", opacity: 0.4, marginTop: 8 }}>
                {design.desc}
              </div>
            </div>
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
}

// Total duration: 4 designs * 120 frames + 90 end pause = 570 frames (19s)
