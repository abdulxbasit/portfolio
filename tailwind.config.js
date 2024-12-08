/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // This is crucial for React
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],  // Since you're using Inter font
      },
    },
  },
  darkMode: 'class',  // Enable dark mode with class-based strategy
  plugins: [],
}