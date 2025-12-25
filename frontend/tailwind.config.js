/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'sidebar-dark': '#0F172A',
        primary: '#2563EB',
        info: '#22C55E',
      },
      borderRadius: {
        card: '12px',
      },
      boxShadow: {
        glow: '0 0 20px rgba(37,99,235,.35)',
      },
    },
  },
  plugins: [],
};
