import { ScrollReveal } from "../ScrollReveal";

export function Problem() {
  return (
    <section className="py-20 px-6">
      <ScrollReveal>
        <div className="max-w-4xl mx-auto">
          <div className="section-label">The Problem</div>
          <h2 className="text-3xl font-light tracking-wide text-white/85 mb-8">
            Why build this?
          </h2>

          <div className="grid grid-cols-3 gap-2.5">
            {/* Row 1: large text + stat */}
            <div className="bento-card col-span-2">
              <p className="text-[15px] leading-relaxed text-white/50">
                Existing dictation tools are clunky. They pop up modal windows,
                break your flow, and feel like an afterthought bolted onto the OS.
                Voice input should be invisible - as seamless as typing.
              </p>
            </div>
            <div className="bento-card flex flex-col items-center justify-center text-center">
              <div className="text-4xl font-extralight text-white/70">2</div>
              <div className="text-[11px] text-white/30 mt-1">Languages</div>
            </div>

            {/* Row 2: bilingual text + accent quote */}
            <div className="bento-card">
              <p className="text-[13px] leading-relaxed text-white/45">
                For bilingual users switching between English and Hebrew,
                it's even worse. No tool auto-detects which language you're speaking.
              </p>
            </div>
            <div className="bento-card bento-card-accent col-span-2">
              <p className="text-sm leading-relaxed text-white/60">
                I wanted something that lives in the background, activates with a
                single key, and gets out of the way the moment you're done.
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
