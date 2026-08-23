/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#7D5435',
        secondary: '#DCC9B2',
        accent: '#AA7A55',
        background: '#F7F1E9',
        surface: '#FCF9F5',
        line: '#E6D7C7',
        text: '#231F1B',
        muted: '#6F645A',
      },
      boxShadow: {
        soft: '0 20px 50px rgba(35, 31, 27, 0.08)',
        card: '0 12px 36px rgba(35, 31, 27, 0.07)',
        editorial: '0 24px 70px rgba(35, 31, 27, 0.12)',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient':
          'radial-gradient(circle at top left, rgba(125, 84, 53, 0.16), transparent 34%), radial-gradient(circle at top right, rgba(170, 122, 85, 0.14), transparent 30%), linear-gradient(180deg, #fbf7f2 0%, #f4ece2 100%)',
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
