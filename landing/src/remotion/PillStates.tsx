import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { WaveformBars } from "./components/WaveformBars";
import { PulsingDots } from "./components/PulsingDots";

const TRANSCRIPT = "Meeting notes for Monday...";

export function PillStates() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timeline:
  // 0-15: idle (nothing)
  // 15-30: pill springs in
  // 30-90: recording with waveform, "Listening..."
  // 90-120: recording with typed transcript
  // 120-140: processing (dots)
  // 140-165: pill springs out
  // 165-180: idle again

  const enterScale = spring({
    fps,
    frame: frame - 15,
    config: { damping: 12, stiffness: 120 },
    durationInFrames: 20,
  });

  const exitScale = spring({
    fps,
    frame: frame - 140,
    config: { damping: 15, stiffness: 100 },
    durationInFrames: 20,
  });

  const pillVisible = frame >= 15 && frame < 165;
  const scale = pillVisible ? enterScale * (1 - exitScale) : 0;

  const isRecording = frame >= 30 && frame < 120;
  const isProcessing = frame >= 120 && frame < 140;

  // Typed transcript
  const typingProgress = interpolate(frame, [90, 118], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const visibleChars = Math.floor(typingProgress * TRANSCRIPT.length);
  const showTranscript = frame >= 90 && frame < 120;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a", justifyContent: "center", alignItems: "center" }}>
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
          transform: `scale(${scale})`,
          opacity: scale,
        }}
      >
        {isRecording && <WaveformBars height={22} />}
        {isProcessing && <PulsingDots />}

        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "white",
            opacity: isProcessing ? 0.35 : showTranscript ? 0.5 : 0.35,
            textAlign: "center",
            width: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {isProcessing
            ? "Processing..."
            : showTranscript
              ? TRANSCRIPT.slice(0, visibleChars)
              : isRecording
                ? "Listening..."
                : ""}
        </div>
      </div>
    </AbsoluteFill>
  );
}
