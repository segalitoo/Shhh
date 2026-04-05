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
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24">
      <ScrollReveal>
        <div className="max-w-4xl w-full">
          <h2 className="text-3xl font-light tracking-wide text-white/90 mb-12 text-center">
            How it works
          </h2>

          <AnimationPlayer
            component={UserFlowDemo}
            durationInFrames={360}
            compositionWidth={1280}
            compositionHeight={800}
          />

          <div className="flex justify-center gap-12 mt-12">
            {STEPS.map((s) => (
              <div key={s.num} className="text-center">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm text-white/60 mx-auto mb-2">
                  {s.num}
                </div>
                <div className="text-sm font-medium text-white/70">{s.label}</div>
                <div className="text-xs text-white/30 mt-1">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
