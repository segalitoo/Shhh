import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { WaveformBars } from "./components/WaveformBars";
import { PulsingDots } from "./components/PulsingDots";

const TRANSCRIPT = "Meeting notes for Monday...";

export function PillStates() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timeline (slowed down):
  // 0-20: idle (nothing)
  // 20-40: pill springs in
  // 40-130: recording with waveform, "Listening..."
  // 130-190: recording with typed transcript
  // 190-230: processing (dots)
  // 230-260: pill springs out
  // 260-350: idle again (3s end pause)

  const enterScale = spring({
    fps,
    frame: frame - 20,
    config: { damping: 12, stiffness: 120 },
    durationInFrames: 20,
  });

  const exitScale = spring({
    fps,
    frame: frame - 230,
    config: { damping: 15, stiffness: 100 },
    durationInFrames: 20,
  });

  const pillVisible = frame >= 20 && frame < 260;
  const scale = pillVisible ? enterScale * (1 - exitScale) : 0;

  const isRecording = frame >= 40 && frame < 190;
  const isProcessing = frame >= 190 && frame < 230;

  // Typed transcript
  const typingProgress = interpolate(frame, [130, 185], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const visibleChars = Math.floor(typingProgress * TRANSCRIPT.length);
  const showTranscript = frame >= 130 && frame < 190;

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

// Total duration: 350 frames (~11.7s)
