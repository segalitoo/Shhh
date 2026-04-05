import { ScrollReveal } from "../ScrollReveal";
import { AnimationPlayer } from "../AnimationPlayer";
import { PillStates } from "../../remotion/PillStates";

const ANNOTATIONS = [
  { label: "Spring animation", desc: "Organic feel for appear/disappear" },
  { label: "9-bar waveform", desc: "Staggered timing, sine-wave driven" },
  { label: "Warm gradient", desc: "Orange-red, not harsh — inviting, not alarming" },
  { label: "Text inside", desc: "No separate panel — everything in one compact pill" },
];

export function ThePill() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24">
      <ScrollReveal>
        <div className="max-w-4xl w-full">
          <h2 className="text-3xl font-light tracking-wide text-white/90 mb-12 text-center">
            Pure Minimal
          </h2>

          <AnimationPlayer
            component={PillStates}
            durationInFrames={180}
            compositionWidth={800}
            compositionHeight={200}
          />

          <div className="grid grid-cols-2 gap-6 mt-12 max-w-xl mx-auto">
            {ANNOTATIONS.map((a) => (
              <div key={a.label}>
                <div className="text-xs uppercase tracking-widest text-[#ff6b6b]/80 mb-1">
                  {a.label}
                </div>
                <div className="text-sm text-white/40">{a.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
