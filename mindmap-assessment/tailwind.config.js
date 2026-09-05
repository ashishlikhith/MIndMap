/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-slate': '#18212B',
        'graphite': '#2A3441',
        'soft-ivory': '#F7F5F2',
        'warm-white': '#FCFBF8',
        'steel-blue': '#56718F',
        'muted-teal': '#5C7F7B',
        'accent-gold': '#C6A86B',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
