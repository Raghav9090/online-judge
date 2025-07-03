/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5a4fcf",       // Purple shade
        accent: "#3490dc",        // Blue shade
        darkBg: "#0e0b1c",        // Elegant dark background
        lightText: "#f4f4f4",
        muted: "#a3a3a3"
      },
    },
  },
  darkMode: "class",
  plugins: [],
}
