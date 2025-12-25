/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Static colors for Samsung Tizen 2.x compatibility (no CSS variables)
        border: "#e5e5e5",
        input: "#e5e5e5",
        ring: "#a3a3a3",
        background: "#ffffff",
        foreground: "#171717",
        primary: {
          DEFAULT: "#262626",
          foreground: "#fafafa",
        },
        secondary: {
          DEFAULT: "#f5f5f5",
          foreground: "#262626",
        },
        destructive: {
          DEFAULT: "#dc2626",
          foreground: "#fafafa",
        },
        muted: {
          DEFAULT: "#f5f5f5",
          foreground: "#737373",
        },
        accent: {
          DEFAULT: "#f5f5f5",
          foreground: "#262626",
        },
        popover: {
          DEFAULT: "#ffffff",
          foreground: "#171717",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#171717",
        },
        sidebar: {
          DEFAULT: "#fafafa",
          foreground: "#171717",
          primary: "#262626",
          "primary-foreground": "#fafafa",
          accent: "#f5f5f5",
          "accent-foreground": "#262626",
          border: "#e5e5e5",
          ring: "#a3a3a3",
        },
        chart: {
          1: "#e97316",
          2: "#0d9488",
          3: "#1e5a73",
          4: "#eab308",
          5: "#f59e0b",
        },
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
      fontFamily: {
        sans: ["Geist", "Geist Fallback", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "Geist Mono Fallback", "ui-monospace", "monospace"],
        serif: ["Source Serif 4", "Source Serif 4 Fallback", "ui-serif", "serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "auto" },
        },
        "accordion-up": {
          from: { height: "auto" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
