import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0a",
        surface: "#111111",
        "accent-start": "#ff6b6b",
        "accent-end": "#ee5a24",
        "pill-bg": "rgba(0,0,0,0.95)",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
