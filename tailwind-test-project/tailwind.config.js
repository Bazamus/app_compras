/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit', // Activar modo JIT explícitamente
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
      colors: {
        'custom-red': '#ff0000',
      }
    },
  },
  plugins: [],
  safelist: [
    'bg-red-500',
    'text-white',
    'p-4',
    'mt-8',
    'rounded-md'
  ]
}
