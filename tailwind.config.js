/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,ts,jsx,tsx}",
    "./src/screens/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/navigation/**/*.{js,ts, jsx,tsx}",
    "./src/api/**/*.{js,ts,jsx,tsx}", // Add if you have api/ folder
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
