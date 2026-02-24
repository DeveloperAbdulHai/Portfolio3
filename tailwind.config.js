/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#050505',
        primary: {
          50: '#e6fff5',
          100: '#ccffeb',
          200: '#99ffd7',
          300: '#66ffc3',
          400: '#33ffaf',
          500: '#00d084',
          600: '#00a66a',
          700: '#007d50',
          800: '#005335',
          900: '#002a1b',
        },
        slate: {
          950: '#050505',
          900: '#0a0a0a',
          800: '#121212',
        }
      }
    },
  },
  plugins: [],
}
