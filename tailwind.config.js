/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")],
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3498db",
        accent: "#f39c12",
        danger: "#e74c3c",
        darkText: "#2c3e50",
        lightGray: "#ecf0f1",
      },
    },
  },
  plugins: [],
};
