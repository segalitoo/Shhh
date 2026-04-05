const TECH = ["Python", "Swift", "Google Cloud STT", "Gemini", "Remotion"];

export function Footer() {
  return (
    <footer className="py-24 px-6 flex flex-col items-center gap-10">
      <h3 className="text-sm uppercase tracking-widest text-white/30">
        Built with
      </h3>
      <div className="flex flex-wrap gap-3 justify-center">
        {TECH.map((t) => (
          <span
            key={t}
            className="px-4 py-1.5 text-xs text-white/40 border border-white/10 rounded-full"
          >
            {t}
          </span>
        ))}
      </div>
      <a
        href="/"
        className="text-sm text-white/30 hover:text-white/60 transition-colors"
      >
        &larr; Back to portfolio
      </a>
    </footer>
  );
}
