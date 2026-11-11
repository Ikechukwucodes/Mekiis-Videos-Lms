/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        ocean: {
          start: '#2193b0',
          end: '#6dd5ed',
          dark: '#17697f',
          light: '#a1e6f5'
        },
        midnight: {
          dark: '#1f4037',
          mint: '#99f2c8',
          deep: '#0a161c',
          slate: '#0f2425'
        }
      }
    },
  },
  plugins: [],
}
