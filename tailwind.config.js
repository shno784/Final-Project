/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}", // ✅ your shared components
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontSize: {
        // Define your custom text sizes:
        base: ["16px", { lineHeight: "24px" }], // Normal text size
        lg: ["18px", { lineHeight: "26px" }],   // Slightly larger
        xl: ["20px", { lineHeight: "28px" }],   // Even larger
        "2xl": ["24px", { lineHeight: "32px" }],  // Largest text size
      },
      colors: {
        // Primary
        'primary-light': '#0072B2',
        'primary-dark': '#56B4E9',

        // Secondary
        'secondary-light': '#E69F00',
        'secondary-dark': '#F0C05A',

        // Tertiary
        'tertiary-light': '#009E73',
        'tertiary-dark': '#44C59E',

        'back-light': '#D55E00',
        'back-dark': '#EF7C5B',
        // You can also add background / text colors here:
        'bg-light': '#e4e4e7',
        'bg-dark': '#1a1a1a',

        // Text colors
        'heading-light': '#111827', 
        'heading-dark': '#F5F5F5', 
        'body-light': '#1f2937',
        'body-dark': 'F5F5F5',
        'buttontext-light': '1f2937',  
        'buttontext-dark': 'F5F5F5', 
      },
    },
  },
  plugins: [],
};
