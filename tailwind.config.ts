import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        app: {
          bg: "#0B0F14",
          surface: "#111820",
          elevated: "#161F29",
          border: "#26313C",
          muted: "#94A3B8",
          text: "#F1F5F9",
          primary: "#3B82F6",
          critical: "#EF4444",
          high: "#F97316",
          medium: "#EAB308",
          low: "#3B82F6",
          success: "#22C55E",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "sans-serif"],
        mono: ["JetBrains Mono", "SFMono-Regular", "Consolas", "monospace"],
      },
      boxShadow: {
        panel: "0 14px 40px rgb(0 0 0 / 0.24)",
      },
    },
  },
  plugins: [],
};

export default config;
