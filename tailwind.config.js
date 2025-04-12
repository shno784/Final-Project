/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontSize: {
        // Define your custom text sizes:
        base: ["16px", { lineHeight: "24px" }], // Normal text size
        lg: ["18px", { lineHeight: "26px" }], // Slightly larger
        xl: ["20px", { lineHeight: "28px" }], // Even larger
        "2xl": ["24px", { lineHeight: "32px" }], // Largest text size
      },
      colors: {
        "primary": "#14B8A6",
        "secondary": "#E69F00",
        "danger": "#FF4C4C",
        text: {
          "head": "#1C1C1C",
          "d-head": "#FFFFFF",
          "main": "#333333",
          "d-main": "#E0E0E0",
        },
        card: {
          "light": "#e5e7eb",
          "dark": "#1f2937",
        },
      },
    },
  },
  plugins: [],
};
