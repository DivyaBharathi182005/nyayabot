/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold:    '#c9a84c',
        danger:  '#e05252',
        success: '#3dba7a',
        warning: '#e8934a',
        muted:   '#5c5870',
        text:    '#e8e3d5',
        bg:      '#07070f',
        border:  'rgba(201,168,76,0.18)',
        accent:  '#c9a84c',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans:  ['DM Sans', 'system-ui', 'sans-serif'],
        mono:  ['JetBrains Mono', 'monospace'],
      },
      borderColor: {
        'gold/30': 'rgba(201,168,76,0.30)',
        'gold/40': 'rgba(201,168,76,0.40)',
        'border/50': 'rgba(201,168,76,0.09)',
      },
    },
  },
  plugins: [],
};
