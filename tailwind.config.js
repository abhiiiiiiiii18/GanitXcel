/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Duolingo-inspired color palette
        primary: {
          DEFAULT: '#58CC02',
          50: '#E8F9D7',
          100: '#D9F5C3',
          200: '#BBEC9A',
          300: '#9DE371',
          400: '#7FDB48',
          500: '#58CC02',
          600: '#469F01',
          700: '#347201',
          800: '#224500',
          900: '#101800',
        },
        secondary: {
          DEFAULT: '#1CB0F6',
          50: '#D4F1FE',
          100: '#B9E9FD',
          200: '#8BDBFC',
          300: '#5DCDFB',
          400: '#2FBFF9',
          500: '#1CB0F6',
          600: '#1089C3',
          700: '#0C6290',
          800: '#083B5D',
          900: '#04142A',
        },
        accent: {
          yellow: '#FFC800',
          orange: '#FF9600',
          red: '#FF4B4B',
          purple: '#CE82FF',
          pink: '#FF85C0',
        },
        // Broken streak mode colors
        sad: {
          50: '#F5F5F5',
          100: '#E5E5E5',
          200: '#D4D4D4',
          300: '#A3A3A3',
          400: '#737373',
          500: '#525252',
          600: '#404040',
          700: '#262626',
          800: '#171717',
          900: '#0A0A0A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Nunito', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'celebration': 'celebration 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-in',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        celebration: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2) rotate(5deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
