import { useEffect, useRef, useState } from "react";

const FEATURES = [
  { icon: "🌐", title: "Bilingual", desc: "English + Hebrew with auto-detection" },
  { icon: "✨", title: "Grammar polish", desc: "Gemini-powered punctuation and correction" },
  { icon: "⚡", title: "Streaming STT", desc: "Real-time interim results as you speak" },
  { icon: "⌘", title: "Right-Command", desc: "Single key tap — no chord, no UI to find" },
  { icon: "📋", title: "Paste anywhere", desc: "Text appears at your cursor in any app" },
  { icon: "👻", title: "Menu bar only", desc: "No Dock icon, no window, invisible when idle" },
];

export function CraftDetails() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24">
      <h2 className="text-3xl font-light tracking-wide text-white/90 mb-14 text-center">
        The details that matter
      </h2>
      <div ref={ref} className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl">
        {FEATURES.map((f, i) => (
          <div
            key={f.title}
            className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: `opacity 0.6s ease-out ${i * 0.1}s, transform 0.6s ease-out ${i * 0.1}s`,
            }}
          >
            <div className="text-2xl mb-3">{f.icon}</div>
            <div className="text-sm font-medium text-white/70 mb-1">{f.title}</div>
            <div className="text-xs text-white/35 leading-relaxed">{f.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
