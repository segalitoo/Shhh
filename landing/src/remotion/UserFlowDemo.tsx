import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MockDesktop } from "./components/MockDesktop";
import { MockEditor } from "./components/MockEditor";
import { KeystrokeIndicator } from "./components/KeystrokeIndicator";
import { WaveformBars } from "./components/WaveformBars";
import { PulsingDots } from "./components/PulsingDots";

const INTERIM_TEXT = "Meeting notes for Monday";
const FINAL_TEXT = "Meeting notes for Monday - review Q2 targets and finalize budget.";

export function UserFlowDemo() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timeline:
  // 0-60: desktop idle, cursor blinking
  // 60: first ⌘R keystroke
  // 75-90: pill springs in
  // 90-240: dictation (waveform + typed interim text)
  // 240: second ⌘R keystroke
  // 250-270: processing dots
  // 270-285: pill springs out
  // 285-360: polished text appears in editor
  // 360-450: 3s end pause before loop

  // Pill visibility
  const pillEnter = spring({
    fps,
    frame: frame - 75,
    config: { damping: 12, stiffness: 120 },
    durationInFrames: 20,
  });
  const pillExit = spring({
    fps,
    frame: frame - 270,
    config: { damping: 15, stiffness: 100 },
    durationInFrames: 15,
  });
  const pillVisible = frame >= 75 && frame < 290;
  const pillScale = pillVisible ? pillEnter * (1 - pillExit) : 0;

  const isRecording = frame >= 90 && frame < 240;
  const isProcessing = frame >= 250 && frame < 270;

  // Interim text typing
  const interimProgress = interpolate(frame, [100, 230], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const interimChars = Math.floor(interimProgress * INTERIM_TEXT.length);

  // Pill text
  let pillText = "";
  if (isRecording) {
    pillText = interimProgress > 0 ? INTERIM_TEXT.slice(0, interimChars) : "Listening...";
  } else if (isProcessing) {
    pillText = "Processing...";
  }

  return (
    <AbsoluteFill>
      <MockDesktop>
        <MockEditor text={FINAL_TEXT} showTextAfterFrame={285} />

        {/* Pill overlay - top center */}
        {pillScale > 0 && (
          <div
            style={{
              position: "absolute",
              top: 40,
              left: "50%",
              transform: `translateX(-50%) scale(${pillScale})`,
              opacity: pillScale,
              zIndex: 10,
            }}
          >
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
              {isRecording && <WaveformBars height={22} />}
              {isProcessing && <PulsingDots />}
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "white",
                  opacity: isProcessing ? 0.35 : interimProgress > 0 ? 0.5 : 0.35,
                  textAlign: "center",
                  width: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {pillText}
              </div>
            </div>
          </div>
        )}

        {/* Keystroke indicators */}
        <KeystrokeIndicator showAtFrame={60} label="⌘R" />
        <KeystrokeIndicator showAtFrame={240} label="⌘R" />
      </MockDesktop>
    </AbsoluteFill>
  );
}

// Total duration: 450 frames (15s)
