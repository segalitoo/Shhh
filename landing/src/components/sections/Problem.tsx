import { ScrollReveal } from "../ScrollReveal";

export function Problem() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <ScrollReveal>
        <div className="max-w-2xl">
          <h2 className="text-3xl font-light tracking-wide text-white/90 mb-10">
            Why build this?
          </h2>
          <div className="space-y-6 text-base text-white/50 leading-relaxed">
            <p>
              Existing dictation tools are clunky. They pop up modal windows,
              break your flow, and feel like an afterthought bolted onto the OS.
              Voice input should be invisible — as seamless as typing.
            </p>
            <p>
              For bilingual users switching between English and Hebrew,
              it's even worse. Most tools don't handle RTL languages well,
              and none auto-detect which language you're speaking.
            </p>
            <p>
              I wanted something that lives in the background, activates with a
              single key, and gets out of the way the moment you're done.
            </p>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
