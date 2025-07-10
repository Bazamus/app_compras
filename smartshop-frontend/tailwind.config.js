/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a202c',
        secondary: '#2d3748',
        accent: '#0694a2'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
  // Incluir explícitamente algunas clases que podrían ser usadas dinámicamente
  safelist: [
    'bg-red-500',
    'bg-green-500',
    'bg-blue-500',
    'text-white',
    'p-4',
    'rounded-md'
  ]
};