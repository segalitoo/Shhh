import { ScrollReveal } from "../ScrollReveal";
import { AnimationPlayer } from "../AnimationPlayer";
import { UserFlowDemo } from "../../remotion/UserFlowDemo";

const STEPS = [
  { num: "1", label: "Tap hotkey", desc: "Right-Command key" },
  { num: "2", label: "Speak", desc: "English or Hebrew" },
  { num: "3", label: "Text appears", desc: "Polished and pasted" },
];

export function UserFlow() {
  return (
    <section className="py-20 px-6">
      <ScrollReveal>
        <div className="max-w-4xl mx-auto">
          <div className="section-label">User Flow</div>
          <h2 className="text-3xl font-light tracking-wide text-white/85 mb-8">
            How it works
          </h2>

          <div className="grid gap-2.5">
            {/* Full-width animation hero card */}
            <div className="bento-card bento-card-accent flex items-center justify-center min-h-[360px] p-4">
              <AnimationPlayer
                component={UserFlowDemo}
                durationInFrames={450}
                compositionWidth={1280}
                compositionHeight={800}
              />
            </div>

            {/* 3 step cards */}
            <div className="grid grid-cols-3 gap-2.5">
              {STEPS.map((s) => (
                <div key={s.num} className="bento-card p-5 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full border border-[#ff6b6b]/30 flex items-center justify-center text-xs text-[#ff6b6b]/70 shrink-0 mt-0.5">
                    {s.num}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white/70">{s.label}</div>
                    <div className="text-xs text-white/35 mt-0.5">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
