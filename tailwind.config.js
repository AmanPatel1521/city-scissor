/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          primary: '#D4AF37',
          light: '#F4E295',
          dark: '#9A7B20',
        },
        rose: {
          gold: '#C98993',
        },
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        syne: ['Syne', 'sans-serif'],
        cormorant: ['Cormorant Garamond', 'serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
