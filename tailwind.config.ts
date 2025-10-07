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

        // Dark Mode Palette ("Aura Lookbook")
        'dark-bg': '#121212',
        'dark-text': '#E5E5E5',
        'dark-accent': '#222222',
        'dark-accent-text': '#808080',

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
