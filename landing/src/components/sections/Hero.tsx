export function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6">
      {/* Idle pill teaser */}
      <div className="w-12 h-2 bg-white/5 rounded-full mb-12" />

      <h1 className="text-6xl font-light tracking-widest text-white/90 lowercase">
        shhh.
      </h1>
      <p className="mt-6 text-lg text-white/40 font-light tracking-wide">
        A macOS dictation tool, designed to disappear.
      </p>
    </section>
  );
}
