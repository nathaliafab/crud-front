// tailwind.config.js
const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  safelist: [
    'animate-spin',
    'animate-ping',
    'animate-bounce',
    'animate-pulse',
    'bg-purple-500',
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui()]
}