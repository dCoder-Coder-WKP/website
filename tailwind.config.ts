import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-base)",
        foreground: "var(--text-primary)",
        bg: {
          base: "var(--bg-base)",
          surface: "var(--bg-surface)",
          raised: "var(--bg-raised)",
          elevated: "var(--bg-elevated)",
        },
        accent: {
          gold: "rgb(var(--accent-gold) / <alpha-value>)",
          "gold-soft": "rgb(var(--accent-gold-soft) / <alpha-value>)",
          ember: "var(--accent-ember)",
          "ember-soft": "var(--accent-ember-soft)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        border: {
          subtle: "var(--border-subtle)",
          refined: "var(--border-refined)",
        },
        luxury: {
          "carona-sunset": "#FF7E5F",
          "carona-glow": "#FEB47B",
          "aldona-lush": "#0B3D0B",
          "river-silk": "#A8C0D0",
          "glass-edge": "rgba(255, 255, 255, 0.2)",
        },
      },
      animation: {
        'fade-in': 'fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-up': 'fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-scale': 'fadeInScale 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'spin-slow': 'spin 30s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInScale: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "serif"],
        sans: ["var(--font-outfit)", "sans-serif"],
      },
      transitionTimingFunction: {
        premium: "var(--ease-premium)",
        smooth: "var(--ease-smooth)",
      },
      transitionDuration: {
        slow: "600ms",
        medium: "400ms",
        fast: "200ms",
      },
      borderRadius: {
        "luxury": "2rem",
      },
    },
  },
  plugins: [],
};
export default config;
