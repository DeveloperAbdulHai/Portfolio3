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
        surface: {
          DEFAULT: 'var(--_theme---base--surface--surface)',
          raised: 'var(--_theme---base--surface--raised)',
          overlay: 'var(--_theme---base--surface--overlay)',
        },
        ink: {
          primary: 'var(--_theme---base--text--primary)',
          secondary: 'var(--_theme---base--text--secondary)',
          muted: 'var(--_theme---base--text--muted)',
        },
        accent: {
          DEFAULT: 'var(--_theme---accent)',
          hover: 'var(--_theme---accent--hover)',
          muted: 'var(--_theme---accent--muted)',
          secondary: 'var(--_theme---accent--secondary)',
          'secondary-muted': 'var(--_theme---accent--secondary--muted)',
          warm: 'var(--_theme---accent--warm)',
          'warm-muted': 'var(--_theme---accent--warm--muted)',
        },
        /* Keep legacy names for rest of app until full migration */
        background: 'var(--_theme---base--surface--surface)',
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
      },
      fontFamily: {
        body: [ 'var(--_typography---font--family--body)' ],
        title: [ 'var(--_typography---font--family--title)' ],
        brand: [ 'var(--_typography---font--family--brand)' ],
      },
      fontSize: {
        xxs: [ 'var(--_typography---font--size--xxs)' ],
        xs: [ 'var(--_typography---font--size--xs)' ],
        sm: [ 'var(--_typography---font--size--sm)' ],
        md: [ 'var(--_typography---font--size--md)' ],
        lg: [ 'var(--_typography---font--size--lg)' ],
        xls: [ 'var(--_typography---font--size--xls)' ],
        xl: [ 'var(--_typography---font--size--xl)' ],
        '2xl': [ 'var(--_typography---font--size--2xl)' ],
        '3xl': [ 'var(--_typography---font--size--3xl)' ],
        '4xl': [ 'var(--_typography---font--size--4xl)' ],
        '5xl': [ 'var(--_typography---font--size--5xl)' ],
        '6xl': [ 'var(--_typography---font--size--6xl)' ],
        '7xl': [ 'var(--_typography---font--size--7xl)' ],
        '8xl': [ 'var(--_typography---font--size--8xl)' ],
      },
      fontWeight: {
        thin: 'var(--_typography---font--weight--thin)',
        extralight: 'var(--_typography---font--weight--extralight)',
        light: 'var(--_typography---font--weight--light)',
        normal: 'var(--_typography---font--weight--regular)',
        medium: 'var(--_typography---font--weight--medium)',
        semibold: 'var(--_typography---font--weight--semibold)',
        bold: 'var(--_typography---font--weight--bold)',
        extrabold: 'var(--_typography---font--weight--extrabold)',
        black: 'var(--_typography---font--weight--black)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        glow: '0 0 60px -15px rgba(0, 208, 132, 0.25)',
      },
    },
  },
  plugins: [],
}
