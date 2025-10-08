import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // container settings can be added here if needed
    extend: {
      colors: {
        // Light Mode Palette ("Showroom")
        'light-bg': '#FFFFFF',
        'light-text': '#111111',
        'light-accent': '#E5E5E5',
        'light-accent-text': '#505050',

        // "Aura Lookbook" Dark Mode Palette
        'aura-black': '#111111',
        'aura-soft-white': '#F0EBE3', // The crucial "goldish tint" text
        'aura-gold': '#B4A284',      // The accent for icons and links
        'aura-green': '#009B77',     // The primary CTA color
        'aura-accent-border': '#222222', // For subtle borders

        // Universal Brand Colors
        'brand-red': '#FF0000',
        'brand-green': '#14DCA0',
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        heading: ["var(--font-satoshi)"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
