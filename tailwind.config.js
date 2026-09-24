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
          blue: '#4a9fd4',
          sky: '#7ec8f0',
        },
      },
      fontFamily: {
        display: ['"ZCOOL KuaiLe"', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
        body: ['"Noto Sans SC"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        felt: 'inset 0 0 60px rgba(0,0,0,0.22)',
        card: '0 3px 8px rgba(0,0,0,0.28)',
        hint: '0 0 0 3px rgba(255, 236, 150, 0.95), 0 0 18px 4px rgba(255, 210, 80, 0.65)',
        'hint-target':
          '0 0 0 3px rgba(120, 230, 200, 0.95), 0 0 16px 3px rgba(80, 200, 170, 0.55)',
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
        'hint-pulse': {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-3px) scale(1.04)' },
        },
      },
      animation: {
        'card-shake': 'card-shake 0.4s ease-in-out',
        'card-deal': 'card-deal 0.35s ease-out',
        'card-land': 'card-land 0.25s ease-out',
        'seq-collect': 'seq-collect 0.45s ease-in forwards',
        'hint-pulse': 'hint-pulse 0.9s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
