/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        felt: {
          DEFAULT: '#1f6b4a',
          dark: '#134832',
          soft: '#2a7d58',
          light: '#3a946a',
        },
        wood: {
          DEFAULT: '#4a3420',
          light: '#6b4a2e',
        },
        gold: {
          DEFAULT: '#c9a35a',
          bright: '#e2c078',
          dim: '#9a7a3a',
        },
        cream: '#f7f3e8',
        suit: {
          red: '#b33a32',
          black: '#1c1c1c',
        },
        chip: {
          blue: '#3a7aad',
        },
      },
      fontFamily: {
        display: ['"ZCOOL KuaiLe"', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
        body: ['"Noto Sans SC"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        felt: 'inset 0 0 60px rgba(0,0,0,0.22)',
        card: '0 3px 8px rgba(0,0,0,0.28)',
      },
      keyframes: {
        'card-shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-4px)' },
          '40%': { transform: 'translateX(4px)' },
          '60%': { transform: 'translateX(-3px)' },
          '80%': { transform: 'translateX(3px)' },
        },
        'card-deal': {
          '0%': { opacity: '0', transform: 'translateY(-12px) scale(0.92)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'card-land': {
          '0%': { transform: 'translateY(-6px)' },
          '100%': { transform: 'translateY(0)' },
        },
        'seq-collect': {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.7) translateY(-20px)' },
        },
      },
      animation: {
        'card-shake': 'card-shake 0.4s ease-in-out',
        'card-deal': 'card-deal 0.35s ease-out',
        'card-land': 'card-land 0.25s ease-out',
        'seq-collect': 'seq-collect 0.45s ease-in forwards',
      },
    },
  },
  plugins: [],
}
