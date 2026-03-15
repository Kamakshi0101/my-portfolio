import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Space Grotesk", "Sora", "sans-serif"],
        body: ["Inter", "Manrope", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        accent: {
          purple: "#a855f7",
          blue: "#3b82f6",
          cyan: "#06b6d4",
          pink: "#ec4899",
          green: "#10b981",
        },
        dark: {
          bg: "#000000",
          surface: "#0a0a1a",
          card: "#0f0f23",
          border: "#1e1e3f",
          text: "#e2e8f0",
          muted: "#94a3b8",
        },
        light: {
          bg: "#f8fafc",
          surface: "#ffffff",
          card: "#f1f5f9",
          border: "#e2e8f0",
          text: "#0f172a",
          muted: "#64748b",
        },
      },
      backgroundImage: {
        "glow-conic":
          "conic-gradient(from 180deg at 50% 50%, #2a8af6 0deg, #a853ba 180deg, #e92a67 360deg)",
        "glass-gradient":
          "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
        "hero-gradient":
          "radial-gradient(ellipse at top left, rgba(99,102,241,0.3), transparent 50%), radial-gradient(ellipse at bottom right, rgba(168,85,247,0.3), transparent 50%)",
      },
      animation: {
        "spin-slow": "spin 20s linear infinite",
        "spin-reverse": "spin 15s linear infinite reverse",
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "typing": "typing 3.5s steps(40) infinite",
        "blink": "blink 1s step-end infinite",
        "fade-up": "fade-up 0.6s ease-out forwards",
        "slide-in-right": "slide-in-right 0.5s ease-out forwards",
        "counter": "counter 2s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 20px rgba(99,102,241,0.5)" },
          "50%": { opacity: "0.8", boxShadow: "0 0 40px rgba(99,102,241,0.8)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
        "glass-hover": "0 16px 48px rgba(0,0,0,0.4), 0 0 30px rgba(99,102,241,0.2), inset 0 1px 0 rgba(255,255,255,0.15)",
        glow: "0 0 30px rgba(99,102,241,0.4)",
        "glow-sm": "0 0 15px rgba(99,102,241,0.3)",
        "glow-purple": "0 0 30px rgba(168,85,247,0.4)",
        "glow-cyan": "0 0 30px rgba(6,182,212,0.4)",
      },
    },
  },
  plugins: [],
};
export default config;
