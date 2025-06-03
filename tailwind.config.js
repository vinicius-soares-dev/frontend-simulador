/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        azulEscuro: "#002B5B",
        azulClaro: "#00B4D8",
        branco: "#FFFFFF",
        cinzaClaro: "#f3f4f6"
      }
    },
  },
  plugins: [],
}
