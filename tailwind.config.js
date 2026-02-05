/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-red': '#722F37',
        'soft-pink': '#F4C2C2',
        'cream-white': '#FFFEF9',
        'beige': '#E8E0D5',
        'card-bg': '#FFFFFF',
        'card-text': '#2C2C2C',
      },
      fontFamily: {
        cursive: ['Alex Brush', 'cursive'],
        serif: ['Lora', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
    },
  },
  plugins: [],
};
