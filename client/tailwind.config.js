/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas:         '#FBF6EC',
        surface:        '#FFFFFF',
        'surface-2':    '#F4EAD3',
        'surface-peach':'#F8C4B0',
        hearth:         '#C44A2C',
        'hearth-glow':  '#E27A3F',
        saffron:        '#F2B544',
        moss:           '#2F5D3F',
        'moss-soft':    '#E5F0E8',
        ink:            '#1F1410',
        'ink-muted':    '#5C4A3A',
        'ink-subtle':   '#7A6B5A',
        danger:         '#B8341F',
        border:         '#E8DFC9',
        'border-strong':'#D6C9A8',
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'Times New Roman', 'serif'],
        sans:  ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono:  ['JetBrains Mono', 'Courier New', 'Courier', 'monospace'],
      },
      boxShadow: {
        sm:         '0 2px 6px rgba(31,20,16,0.04)',
        md:         '0 4px 12px rgba(31,20,16,0.08)',
        lift:       '0 2px 6px rgba(31,20,16,0.04), 0 12px 32px rgba(31,20,16,0.06)',
        'lift-hover':'0 4px 10px rgba(31,20,16,0.06), 0 20px 44px rgba(31,20,16,0.10)',
        cta:        '0 4px 14px rgba(196,74,44,0.35)',
      },
      letterSpacing: {
        'widest-2': '0.18em',
        'widest-3': '0.24em',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
