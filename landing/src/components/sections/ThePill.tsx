import { ScrollReveal } from "../ScrollReveal";
import { AnimationPlayer } from "../AnimationPlayer";
import { PillStates } from "../../remotion/PillStates";

const ANNOTATIONS = [
  { label: "Spring", desc: "Organic feel for appear/disappear" },
  { label: "9-bar waveform", desc: "Staggered timing, sine-wave driven" },
  { label: "Warm gradient", desc: "Orange-red, not harsh - inviting" },
  { label: "All-in-one", desc: "Text inside, no separate panel" },
];

export function ThePill() {
  return (
    <section className="py-20 px-6">
      <ScrollReveal>
        <div className="max-w-4xl mx-auto">
          <div className="section-label">The Solution</div>
          <h2 className="text-3xl font-light tracking-wide text-white/85 mb-8">
            Pure Minimal
          </h2>

          <div className="grid gap-2.5">
            {/* Full-width animation hero card */}
            <div className="bento-card bento-card-accent flex items-center justify-center min-h-[200px] p-4">
              <AnimationPlayer
                component={PillStates}
                durationInFrames={350}
                compositionWidth={800}
                compositionHeight={200}
              />
            </div>

            {/* 4 annotation cards */}
            <div className="grid grid-cols-4 gap-2.5">
              {ANNOTATIONS.map((a) => (
                <div key={a.label} className="bento-card p-4">
                  <div className="text-[10px] uppercase tracking-widest text-[#ff6b6b]/50 mb-1">
                    {a.label}
                  </div>
                  <div className="text-xs text-white/35 leading-relaxed">{a.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
