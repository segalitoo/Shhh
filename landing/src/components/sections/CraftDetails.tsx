import { ScrollReveal } from "../ScrollReveal";

const FEATURES = [
  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>, title: "Bilingual", desc: "English + Hebrew with auto-detection" },
  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z"/></svg>, title: "Grammar polish", desc: "Gemini-powered punctuation and correction" },
  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>, title: "Streaming STT", desc: "Real-time interim results as you speak" },
  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg>, title: "Right-Command", desc: "Single key tap - no chord, no UI to find" },
  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>, title: "Paste anywhere", desc: "Text appears at your cursor in any app" },
  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h1m8-9v1m8 8h1M5.6 5.6l.7.7m12.1-.7-.7.7"/><path d="M8 21h8"/><path d="M12 17v4"/><circle cx="12" cy="12" r="4"/></svg>, title: "Menu bar only", desc: "No Dock icon, no window, invisible when idle" },
];

export function CraftDetails() {
  return (
    <section className="py-20 px-6">
      <ScrollReveal>
        <div className="max-w-4xl mx-auto">
          <div className="section-label">Craft</div>
          <h2 className="text-3xl font-light tracking-wide text-white/85 mb-8">
            The details that matter
          </h2>

          <div className="grid grid-cols-3 gap-2.5">
            {FEATURES.map((f) => (
              <div key={f.title} className="bento-card p-5">
                <div className="w-9 h-9 rounded-xl bg-white/[0.04] flex items-center justify-center text-white/40 mb-3">
                  {f.icon}
                </div>
                <div className="text-sm font-medium text-white/70 mb-1">{f.title}</div>
                <div className="text-xs text-white/35 leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
