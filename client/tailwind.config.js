/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#8B5E3C',
        secondary: '#D9C2A7',
        background: '#F8F5F2',
        accent: '#B08968',
        text: '#2C2C2C',
      },
      boxShadow: {
        soft: '0 18px 50px rgba(44, 44, 44, 0.08)',
        card: '0 10px 30px rgba(44, 44, 44, 0.07)',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient':
          'radial-gradient(circle at top left, rgba(139, 94, 60, 0.18), transparent 35%), linear-gradient(180deg, #fff8f2 0%, #f8f5f2 100%)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(18px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.6s ease-out both',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
