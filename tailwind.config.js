/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0a0a',
          surface: '#1a1a1a',
          border: '#2a2a2a',
          text: '#ffffff',
          'text-secondary': '#a0a0a0',
        },
        purple: {
          primary: '#8b5cf6',
          hover: '#7c3aed',
          light: '#a78bfa',
        },
        green: {
          profit: '#10b981',
          'profit-light': '#34d399',
        },
        red: {
          loss: '#ef4444',
          'loss-light': '#f87171',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      },
    },
  },
  plugins: [],
}