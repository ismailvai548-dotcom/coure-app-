/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'var(--font-hind-siliguri)',
          'var(--font-plus-jakarta)',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
      },
      colors: {
        brand: {
          50: '#effdf6',
          100: '#d9f9e9',
          500: '#0d9467',
          600: '#067652',
          700: '#075e43',
          800: '#084b37',
          900: '#073e2e',
        },
      },
    },
  },
  plugins: [],
};

export default config;
