/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        groww: {
          green: '#00D09C',
          greenLight: '#10E7B0',
          greenDark: '#00B386',
          greenBg: 'rgba(0, 208, 156, 0.12)',
          red: '#EB5757',
          redLight: '#FF6B6B',
          redBg: 'rgba(235, 87, 87, 0.12)',
          dark: '#0B0E14',
          card: '#151922',
          cardHover: '#1B212D',
          border: '#232936',
          textMuted: '#94A3B8',
          textLight: '#F1F5F9',
          blue: '#4F46E5',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flash-green': 'flashGreen 0.6s ease-out',
        'flash-red': 'flashRed 0.6s ease-out',
      },
      keyframes: {
        flashGreen: {
          '0%': { backgroundColor: 'rgba(0, 208, 156, 0.35)' },
          '100%': { backgroundColor: 'transparent' },
        },
        flashRed: {
          '0%': { backgroundColor: 'rgba(235, 87, 87, 0.35)' },
          '100%': { backgroundColor: 'transparent' },
        }
      }
    },
  },
  plugins: [],
}
