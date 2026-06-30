/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pokemon: {
          red: '#DC2626',
          darkred: '#991B1B',
          yellow: '#FBBF24',
          dark: '#1E1E2E',
          darker: '#13131F',
          card: '#252535',
        }
      },
    },
  },
  plugins: [],
}
