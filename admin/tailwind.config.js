/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ApexCourrier brand palette — kept in step with the public site.
        primary: "#ff7700",
        secondary: "#ff7700",
        brand: {
          DEFAULT: "#ff7700",
          dark: "#e56a00",
          tint: "#fff3e8",
        },
        ink: "#2f2f2f",
        muted: "#757575",
      },
    },
  },
  plugins: [],
};
