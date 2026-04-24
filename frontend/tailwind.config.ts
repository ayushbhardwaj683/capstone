import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        mist: "#f8fafc",
        accent: "#0f766e",
        warm: "#f97316",
        border: "hsl(var(--border))",
      }
    }
  },
  plugins: []
};

export default config;
