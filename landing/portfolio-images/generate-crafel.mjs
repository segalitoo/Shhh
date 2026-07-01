import puppeteer from "puppeteer";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const W = 2120;
const H = 1120;

// Crafel design-system tokens
const INK = "#0C1330";
const SECONDARY = "#5A6377";
const MUTED = "#8A92A3";
const BORDER = "#E3E8EF";
const BORDER_STRONG = "#CBD2DD";
const SURFACE_1 = "#F6F8FB";
const SURFACE_SUNKEN = "#EEF1F6";
const PRIMARY = "#2563EB";
const TEXT_ACCENT = "#B53324";
const ACCENT = "#FF5D52";
const INK_DARK = "#0C1020";

const SANS = `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`;
const SERIF = `'DM Serif Display', Georgia, serif`;

const bars = (hs, w = 7) =>
  hs
    .map(
      (h) =>
        `<div style="width:${w}px;height:${h}px;border-radius:3px;background:linear-gradient(180deg,#FF7A70,#E84A40)"></div>`
    )
    .join("");

const pill = (text, scale = 1) => `
  <div style="transform:scale(${scale});display:inline-flex;flex-direction:column;align-items:center;gap:14px;background:${INK_DARK};border-radius:40px;padding:24px 46px;box-shadow:0 26px 70px rgba(12,16,32,0.30)">
    <div style="display:flex;gap:6px;align-items:center;height:44px">${bars([10, 20, 30, 40, 44, 40, 30, 20, 10])}</div>
    <div style="font-family:${SANS};font-size:22px;font-weight:500;color:rgba(255,255,255,0.55)">${text}</div>
  </div>`;

const eyebrow = (t, color = TEXT_ACCENT) =>
  `<div style="font-family:${SANS};font-size:15px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:${color}">${t}</div>`;

const serifTitle = (t, size = 52, color = INK) =>
  `<div style="font-family:${SERIF};font-size:${size}px;line-height:1.1;letter-spacing:-0.01em;color:${color}">${t}</div>`;

const doc = (inner, bg = "#FFFFFF") => `<!DOCTYPE html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet">
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:${SANS};-webkit-font-smoothing:antialiased}</style></head>
<body><div style="width:${W}px;height:${H}px;background:${bg};position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center">${inner}</div></body></html>`;

// ── Image A: Hero ──────────────────────────────────────────
const hero = doc(`
  <div style="position:absolute;width:1100px;height:1100px;border-radius:50%;background:radial-gradient(circle,rgba(37,99,235,0.05) 0%,rgba(255,93,82,0.05) 42%,transparent 68%);top:50%;left:50%;transform:translate(-50%,-50%);filter:blur(90px)"></div>
  <div style="position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:44px;text-align:center">
    <div style="font-family:${SERIF};font-style:italic;font-size:210px;line-height:0.85;letter-spacing:-0.02em;color:${INK}">shhh.</div>
    <div style="font-family:${SANS};font-size:32px;font-weight:400;color:${SECONDARY}">A macOS dictation tool, designed to disappear.</div>
    <div style="margin-top:34px">${pill("I want to send a quick note", 1.5)}</div>
  </div>
`, "#FFFFFF");

// ── Image B: Design exploration (2x2) ──────────────────────
const fullIsland = `
  <div style="width:520px;background:${INK_DARK};border-radius:40px;padding:26px 40px;display:flex;flex-direction:column;gap:14px;box-shadow:0 20px 50px rgba(12,16,32,0.30)">
    <div style="display:flex;align-items:center;justify-content:space-between">
      <div style="width:14px;height:14px;border-radius:50%;background:${ACCENT}"></div>
      <div style="display:flex;gap:5px;align-items:center">${bars([10, 20, 30, 38, 30, 20, 10], 6)}</div>
      <span style="font-family:${SANS};font-size:22px;font-weight:500;color:rgba(255,255,255,0.6);font-variant-numeric:tabular-nums">0:03</span>
    </div>
    <div style="font-family:${SANS};font-size:22px;color:rgba(255,255,255,0.5);text-align:center">Let's start a new project...</div>
  </div>`;

const slimDropdown = `
  <div style="display:flex;flex-direction:column;align-items:center;gap:16px">
    <div style="background:${INK_DARK};border-radius:40px;padding:20px 32px;display:flex;align-items:center;gap:18px;box-shadow:0 16px 40px rgba(12,16,32,0.30)">
      <div style="width:12px;height:12px;border-radius:50%;background:${ACCENT}"></div>
      <div style="display:flex;gap:5px;align-items:center">${bars([10, 20, 30, 38, 30, 20, 10], 6)}</div>
      <span style="font-family:${SANS};font-size:20px;font-weight:500;color:rgba(255,255,255,0.55);font-variant-numeric:tabular-nums">0:03</span>
    </div>
    <div style="background:${INK_DARK};border-radius:24px;padding:16px 28px;font-family:${SANS};font-size:20px;color:rgba(255,255,255,0.5);box-shadow:0 12px 30px rgba(12,16,32,0.25)">Let's start a new project...</div>
  </div>`;

const redRing = `
  <div style="width:520px;background:${INK_DARK};border-radius:40px;padding:26px 40px;display:flex;flex-direction:column;gap:14px;border:3px solid rgba(255,93,82,0.55);box-shadow:0 0 50px rgba(255,93,82,0.18),0 16px 40px rgba(12,16,32,0.30)">
    <div style="display:flex;align-items:center;justify-content:space-between">
      <div style="width:14px;height:14px;border-radius:50%;background:${ACCENT}"></div>
      <div style="display:flex;gap:5px;align-items:center">${bars([10, 20, 30, 38, 30, 20, 10], 6)}</div>
      <span style="font-family:${SANS};font-size:22px;font-weight:500;color:rgba(255,255,255,0.6);font-variant-numeric:tabular-nums">0:03</span>
    </div>
    <div style="font-family:${SANS};font-size:22px;color:rgba(255,255,255,0.5);text-align:center">Let's start a new project...</div>
  </div>`;

const pureMinimal = `
  <div style="background:${INK_DARK};border-radius:40px;padding:24px 46px;display:flex;flex-direction:column;align-items:center;gap:14px;box-shadow:0 20px 50px rgba(12,16,32,0.30)">
    <div style="display:flex;gap:6px;align-items:center;height:44px">${bars([10, 20, 30, 40, 44, 40, 30, 20, 10])}</div>
    <div style="font-family:${SANS};font-size:22px;color:rgba(255,255,255,0.55)">Let's start a new project...</div>
  </div>`;

const card = (inner, name, desc, chosen = false) => `
  <div style="background:#FFFFFF;border:1px solid ${chosen ? BORDER_STRONG : BORDER};border-radius:24px;padding:48px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:26px;position:relative;${chosen ? "box-shadow:0 22px 54px rgba(12,19,48,0.10)" : ""}">
    ${chosen ? `<div style="position:absolute;top:26px;right:26px;background:${PRIMARY};color:#fff;font-family:${SANS};font-size:13px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;padding:5px 13px;border-radius:99px">Chosen</div>` : ""}
    <div style="min-height:190px;display:flex;align-items:center;justify-content:center">${inner}</div>
    <div style="text-align:center">
      <div style="font-family:${SANS};font-size:23px;font-weight:600;color:${INK}">${name}</div>
      <div style="font-family:${SANS};font-size:17px;color:${SECONDARY};margin-top:6px">${desc}</div>
    </div>
  </div>`;

const exploration = doc(`
  <div style="display:flex;flex-direction:column;align-items:center;gap:14px;padding:64px 70px;width:100%">
    ${eyebrow("Design exploration")}
    ${serifTitle("Finding the right UI", 52)}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:28px;width:100%;max-width:1820px;margin-top:32px">
      ${card(fullIsland, "Full island", "Red dot, timer, and transcript")}
      ${card(slimDropdown, "Slim + dropdown", "Compact pill, separate panel")}
      ${card(redRing, "Red ring", "Pulsing border, cinematic feel")}
      ${card(pureMinimal, "Pure minimal", "Just waveform and text", true)}
    </div>
  </div>
`, SURFACE_1);

// ── Image C: How it works (flow) ───────────────────────────
const circle = (n, active) =>
  `<div style="width:58px;height:58px;border-radius:50%;border:2px solid ${active ? ACCENT : BORDER_STRONG};display:flex;align-items:center;justify-content:center;font-family:${SANS};font-size:23px;font-weight:600;color:${active ? TEXT_ACCENT : MUTED};background:#fff;${active ? "box-shadow:0 0 0 6px rgba(255,93,82,0.08)" : ""}">${n}</div>`;

const arrow = `<div style="display:flex;align-items:flex-start;padding-top:22px"><svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="${BORDER_STRONG}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></div>`;

const idleBar = `<div style="width:280px;height:12px;border-radius:6px;background:${SURFACE_SUNKEN}"></div>`;

const listeningPill = `
  <div style="background:${INK_DARK};border-radius:34px;padding:20px 34px;display:flex;flex-direction:column;align-items:center;gap:12px;box-shadow:0 18px 44px rgba(12,16,32,0.30)">
    <div style="display:flex;gap:5px;align-items:center;height:36px">${bars([8, 16, 24, 32, 36, 32, 24, 16, 8], 6)}</div>
    <div style="font-family:${SANS};font-size:19px;font-weight:500;color:rgba(255,255,255,0.55)">Listening...</div>
  </div>`;

const donePill = `
  <div style="display:flex;flex-direction:column;align-items:center;gap:16px">
    <div style="background:${INK_DARK};border-radius:34px;padding:20px 32px;display:flex;align-items:center;gap:10px;box-shadow:0 18px 44px rgba(12,16,32,0.30)">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${ACCENT}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      <span style="font-family:${SANS};font-size:19px;font-weight:500;color:rgba(255,255,255,0.6)">Pasted to cursor</span>
    </div>
    <div style="background:#FFFFFF;border:1px solid ${BORDER};border-radius:14px;padding:14px 22px;max-width:340px">
      <div style="font-family:${SANS};font-size:16px;color:${SECONDARY};line-height:1.6">Let's start a new project and outline the key milestones for Q2.</div>
    </div>
  </div>`;

const step = (n, active, title, sub, content) => `
  <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:22px">
    ${circle(n, active)}
    <div style="text-align:center">
      <div style="font-family:${SANS};font-size:24px;font-weight:600;color:${INK}">${title}</div>
      <div style="font-family:${SANS};font-size:17px;color:${MUTED};margin-top:4px">${sub}</div>
    </div>
    <div style="margin-top:8px;width:100%;background:#FFFFFF;border:1px solid ${active ? BORDER_STRONG : BORDER};border-radius:24px;min-height:250px;display:flex;align-items:center;justify-content:center;padding:30px;${active ? "box-shadow:0 22px 54px rgba(12,19,48,0.08)" : ""}">${content}</div>
  </div>`;

const flow = doc(`
  <div style="display:flex;flex-direction:column;align-items:center;gap:14px;padding:70px 90px;width:100%">
    ${eyebrow("How it works")}
    ${serifTitle("Three steps. Zero friction.", 52)}
    <div style="display:flex;align-items:flex-start;gap:20px;width:100%;max-width:1820px;margin-top:44px">
      ${step("1", false, "Tap hotkey", "Right-Command key", idleBar)}
      ${arrow}
      ${step("2", true, "Speak", "English or Hebrew", listeningPill)}
      ${arrow}
      ${step("3", false, "Text appears", "Polished and pasted", donePill)}
    </div>
  </div>
`, SURFACE_1);

// ── Image D: In context (Notes window) ─────────────────────
const notes = doc(`
  <div style="width:1840px;height:1000px;background:#FFFFFF;border-radius:18px;box-shadow:0 34px 100px rgba(12,19,48,0.20);border:1px solid ${BORDER};position:relative;overflow:hidden">
    <div style="height:56px;background:${SURFACE_1};border-bottom:1px solid ${BORDER};display:flex;align-items:center;padding:0 22px;gap:9px">
      <div style="width:13px;height:13px;border-radius:50%;background:#ff5f57"></div>
      <div style="width:13px;height:13px;border-radius:50%;background:#febc2e"></div>
      <div style="width:13px;height:13px;border-radius:50%;background:#28c840"></div>
      <div style="flex:1;text-align:center;font-family:${SANS};font-size:15px;color:${MUTED};font-weight:500">Notes.app</div>
    </div>
    <div style="padding:72px 96px">
      <div style="font-family:${SANS};font-size:36px;font-weight:600;color:${INK};margin-bottom:30px">Meeting notes: Q2 planning</div>
      <div style="font-family:${SANS};font-size:22px;color:${SECONDARY};line-height:2">
        <div>Review Q2 targets and finalize budget allocations.</div>
        <div>Key discussion points from today's session:</div>
        <div style="margin-top:14px">1. Revenue targets need adjustment based on Q1 performance</div>
        <div>2. Engineering headcount approved for two additional roles</div>
        <div>3. Product roadmap aligned with customer feedback themes</div>
        <div style="margin-top:14px;color:${MUTED}">Review Q2 targets and finalize the budget by Friday.<span style="display:inline-block;width:2px;height:22px;background:${PRIMARY};margin-left:2px;vertical-align:text-bottom"></span></div>
      </div>
    </div>
    <div style="position:absolute;top:78px;left:50%;transform:translateX(-50%) scale(1.45);z-index:10">
      ${pill("Review Q2 targets and finalize...", 1)}
    </div>
  </div>
`, SURFACE_SUNKEN);

const pages = [
  { name: "shhh-crafel-hero", html: hero },
  { name: "shhh-crafel-exploration", html: exploration },
  { name: "shhh-crafel-flow", html: flow },
  { name: "shhh-crafel-notes", html: notes },
];

async function main() {
  const browser = await puppeteer.launch({ headless: true });
  for (const page of pages) {
    const p = await browser.newPage();
    await p.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
    await p.setContent(page.html, { waitUntil: "networkidle0" });
    await p.evaluateHandle("document.fonts.ready");
    await new Promise((r) => setTimeout(r, 400));
    const outPath = resolve(__dirname, `${page.name}.png`);
    await p.screenshot({ path: outPath, type: "png" });
    console.log(`Saved: ${outPath}`);
    await p.close();
  }
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
