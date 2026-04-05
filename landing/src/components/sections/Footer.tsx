const TECH = ["Python", "Swift", "Google Cloud STT", "Gemini", "Remotion"];

export function Footer() {
  return (
    <footer className="py-16 px-6">
      <div className="divider mb-12" />
      <div className="flex flex-col items-center gap-8">
        <h3 className="text-[10px] uppercase tracking-widest text-white/25">
          Built with
        </h3>
        <div className="flex flex-wrap gap-2.5 justify-center">
          {TECH.map((t) => (
            <span
              key={t}
              className="px-4 py-1.5 text-xs text-white/40 border border-white/[0.06] rounded-full"
            >
              {t}
            </span>
          ))}
        </div>
        <a
          href="https://segalitoo.github.io/ran-portfolio/"
          className="text-xs text-white/25 hover:text-white/50 transition-colors"
        >
          &larr; Back to portfolio
        </a>
      </div>
    </footer>
  );
}
