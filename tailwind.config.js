/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
      'poppins': ['poppins', 'sans-serif'],
    },
    },
    animation: {
      background: 'background ease infinite',
    },
    keyframes: {
      background: {
        '0%, 100%': { backgroundColor: 'green' },
        '50%': { backgroundColor: 'red' },
      },
    },
  },
  plugins: [],
}

