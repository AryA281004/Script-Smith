/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        blanka: ['Blanka', 'sans-serif'],
        sharetech: ["Share Tech", "sans-serif"],
      },
    },
  },
  plugins: [
     require('@tailwindcss/typography'),
  ],
};

