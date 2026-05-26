/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        normal:  { bg: '#dcfce7', text: '#16a34a', border: '#86efac' },
        high:    { bg: '#fee2e2', text: '#dc2626', border: '#fca5a5' },
        prediab: { bg: '#fef9c3', text: '#ca8a04', border: '#fde047' },
        low:     { bg: '#dbeafe', text: '#2563eb', border: '#93c5fd' },
      }
    },
  },
  plugins: [],
}
