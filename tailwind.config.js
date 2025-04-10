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
        body: {
          "light": "#E4E4E7",
          "dark": "#1A1A1A",
        },
        text: {
          "head": "#1C1C1C",
          "d-head": "#FFFFFF",
          "main": "#333333",
          "d-main": "#E0E0E0",
          "subtext": "#666666",
          "d-subtext": "#A0A0A0",
        },
        button: {
          "primary": "#0072B2",
          "d-primary": "#56B4E9",
          "secondary": "#E69F00",
          "d-secondary": "#F0C05A",
          "tertiary": "#009E73",
          "d-tertiary": "#44C59E",
          "back": "#D55E00",
          "d-back": "#EF7C5B",
          "danger": "#B00020",
          "d-danger": "#FF4C4C",
        },
        card: {
          "light": "#F5F5F5",
          "dark": "#2A2A2A",
        },
      },
    },
  },
  plugins: [],
};
