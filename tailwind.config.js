/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          0: '#07070d',
          1: '#0c0c14',
          2: '#11111b',
          3: '#161622',
          4: '#1e1e2e',
        },
        accent: {
          violet: '#8b5cf6',
          cyan: '#22d3ee',
          emerald: '#34d399',
          amber: '#fbbf24',
          rose: '#f43f5e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-violet': '0 0 20px -5px rgba(139, 92, 246, 0.3)',
        'glow-cyan': '0 0 20px -5px rgba(34, 211, 238, 0.3)',
        'card': '0 1px 3px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.04)',
        'card-hover': '0 8px 30px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)',
      },
    },
  },
  plugins: [],
}
