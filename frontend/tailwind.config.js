/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#dde6ff',
          200: '#b9cdff',
          400: '#6b8ef5',
          500: '#4f6ef7',
          600: '#3b5bf5',
          700: '#2c48d4',
          900: '#1a2d8a',
        },
        sage: {
          50:  '#f0fdf6',
          100: '#d1fae5',
          400: '#34d399',
          600: '#059669',
        },
        amber: {
          50:  '#fffbeb',
          100: '#fef3c7',
          400: '#fbbf24',
          600: '#d97706',
        },
        rose: {
          50:  '#fff1f2',
          100: '#ffe4e6',
          500: '#f43f5e',
          700: '#be123c',
        },
        canvas: '#eef1fb',
        muted:  '#e8ecf8',
      },
      fontFamily: {
        sans:  ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono:  ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Ccircle cx='20' cy='20' r='1' fill='%23c7d2fe' fill-opacity='0.5'/%3E%3C/g%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'soft':  '0 2px 20px -4px rgba(0,0,0,0.08)',
        'float': '0 12px 32px -8px rgba(0,0,0,0.12)',
        'glow':  '0 0 0 4px rgba(79,110,247,0.15)',
      },
      animation: {
        'slide-in': 'slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'pop':      'pop 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        slideIn: { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        pop:     { from: { opacity: 0, transform: 'scale(0.95)' },      to: { opacity: 1, transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
}
