import { ScrollReveal } from "../ScrollReveal";
import { AnimationPlayer } from "../AnimationPlayer";
import { DesignIteration } from "../../remotion/DesignIteration";

export function DesignExploration() {
  return (
    <section className="py-20 px-6">
      <ScrollReveal>
        <div className="max-w-4xl mx-auto">
          <div className="section-label">Design Exploration</div>
          <h2 className="text-3xl font-light tracking-wide text-white/85 mb-8">
            Finding the right UI
          </h2>

          <div className="grid grid-cols-[1fr_1.8fr] gap-2.5">
            {/* Left: intro text */}
            <div className="bento-card">
              <p className="text-[13px] leading-relaxed text-white/50">
                Inspired by Apple's Dynamic Island, I explored several approaches
                for a floating dictation indicator - from information-dense to radically minimal.
              </p>
            </div>

            {/* Right: hero animation card spanning 2 rows */}
            <div className="bento-card bento-card-accent row-span-2 flex items-center justify-center min-h-[320px] p-4">
              <AnimationPlayer
                component={DesignIteration}
                durationInFrames={570}
                compositionWidth={1280}
                compositionHeight={720}
              />
            </div>

            {/* Left: conclusion */}
            <div className="bento-card">
              <p className="text-[12px] leading-relaxed text-white/35">
                <strong className="text-white/60">Pure Minimal won.</strong> No timer, no red dot - just waveform and text.
                A dictation tool should tell you it's listening, not demand your attention.
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
