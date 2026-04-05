export function Hero() {
  return (
    <section className="h-[60vh] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Radial glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,107,107,0.06) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          filter: "blur(60px)",
        }}
      />

      {/* Idle pill teaser - animated */}
      <div
        className="w-12 h-1.5 bg-white/[0.06] rounded-full mb-10"
        style={{ animation: "pill-pulse 3s ease-in-out infinite" }}
      />

      <h1 className="text-7xl font-extralight tracking-[12px] text-white/90 lowercase relative">
        shhh.
      </h1>
      <p className="mt-5 text-base text-white/35 font-light tracking-widest">
        A macOS dictation tool, designed to disappear.
      </p>

      {/* Scroll hint */}
      <div
        className="absolute bottom-10 text-[10px] uppercase tracking-[3px] text-white/15"
        style={{ animation: "float 2s ease-in-out infinite" }}
      >
        Scroll to explore
      </div>
    </section>
  );
}
