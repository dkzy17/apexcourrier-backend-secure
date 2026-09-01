/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#ff7700",
        secondary: "#ff7700",
        brand: {
          DEFAULT: "#ff7700",
          dark: "#e56a00",
          tint: "#fff3e8",
        },
        ink: "#2f2f2f",
        body: "#333333",
        muted: "#757575",
        line: "#c3c6cc",
        dark: "#0c0c0c",
        light: "#fcfaf8",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-manrope)", "var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "2px",
      },
      keyframes: {
        sheen: {
          "0%, 60%": { transform: "translateX(0)", opacity: "0" },
          "65%": { opacity: "1" },
          "100%": { transform: "translateX(var(--sheen-travel, 340px))", opacity: "0" },
        },
        // Travels down the unfilled part of the tracking bar to read as
        // "still in progress" rather than "finished and empty".
        trackPulse: {
          "0%": { transform: "translateY(-120%)", opacity: "0" },
          "25%": { opacity: "1" },
          "75%": { opacity: "1" },
          "100%": { transform: "translateY(420%)", opacity: "0" },
        },
      },
      animation: {
        sheen: "sheen 3.2s ease-in-out infinite",
        "track-pulse": "trackPulse 2.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
