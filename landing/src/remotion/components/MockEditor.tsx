import { interpolate, useCurrentFrame } from "remotion";

type MockEditorProps = {
  text: string;
  showTextAfterFrame: number;
};

export function MockEditor({ text, showTextAfterFrame }: MockEditorProps) {
  const frame = useCurrentFrame();

  const typingProgress = interpolate(
    frame,
    [showTextAfterFrame, showTextAfterFrame + 40],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const visibleChars = Math.floor(typingProgress * text.length);
  const showText = frame >= showTextAfterFrame;

  const cursorVisible = Math.floor(frame / 15) % 2 === 0;

  return (
    <div
      style={{
        position: "absolute",
        top: 50,
        left: 40,
        right: 40,
        bottom: 40,
        background: "#1a1a1a",
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.1)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: 32,
          background: "rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          padding: "0 12px",
          gap: 8,
        }}
      >
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
        <span style={{ fontSize: 11, color: "white", opacity: 0.4, marginLeft: 8 }}>
          Notes - Untitled
        </span>
      </div>
      <div style={{ padding: 16, fontSize: 14, color: "white", opacity: 0.8, lineHeight: 1.6 }}>
        {showText && text.slice(0, visibleChars)}
        {cursorVisible && (
          <span style={{ borderLeft: "2px solid rgba(255,255,255,0.6)", marginLeft: 1 }}>
            &nbsp;
          </span>
        )}
      </div>
    </div>
  );
}
