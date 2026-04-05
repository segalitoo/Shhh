import { ScrollReveal } from "../ScrollReveal";
import { AnimationPlayer } from "../AnimationPlayer";
import { DesignIteration } from "../../remotion/DesignIteration";

export function DesignExploration() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24">
      <ScrollReveal>
        <div className="max-w-4xl w-full">
          <h2 className="text-3xl font-light tracking-wide text-white/90 mb-4 text-center">
            Finding the right UI
          </h2>
          <p className="text-base text-white/40 mb-12 text-center max-w-xl mx-auto">
            Inspired by Apple's Dynamic Island, I explored several approaches
            for a floating dictation indicator — from information-dense to radically minimal.
          </p>

          <AnimationPlayer
            component={DesignIteration}
            durationInFrames={240}
            compositionWidth={1280}
            compositionHeight={720}
          />

          <p className="text-sm text-white/30 mt-8 text-center max-w-lg mx-auto leading-relaxed">
            Pure Minimal won. No timer, no red dot — just waveform and text.
            A dictation tool should tell you it's listening, not demand your attention.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
