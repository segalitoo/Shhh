import { spring, useCurrentFrame, useVideoConfig } from "remotion";

type KeystrokeIndicatorProps = {
  showAtFrame: number;
  label?: string;
};

export function KeystrokeIndicator({ showAtFrame, label = "⌘R" }: KeystrokeIndicatorProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < showAtFrame) return null;

  const enter = spring({
    fps,
    frame: frame - showAtFrame,
    config: { damping: 15, stiffness: 120 },
    durationInFrames: 15,
  });

  const exit = spring({
    fps,
    frame: frame - showAtFrame - 25,
    config: { damping: 15, stiffness: 100 },
    durationInFrames: 15,
  });

  const opacity = enter * (1 - exit);
  if (opacity < 0.01) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 60,
        left: "50%",
        transform: `translateX(-50%) scale(${0.8 + 0.2 * enter})`,
        opacity,
        background: "rgba(255,255,255,0.1)",
        backdropFilter: "blur(10px)",
        borderRadius: 8,
        padding: "6px 14px",
        fontSize: 14,
        fontWeight: 500,
        color: "white",
        border: "1px solid rgba(255,255,255,0.15)",
      }}
    >
      {label}
    </div>
  );
}
