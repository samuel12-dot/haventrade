/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas:         '#FFFFFF',
        surface:        '#FAFAFA',
        'surface-2':    '#F2F2F2',
        'surface-peach':'#F8C4B0',
        hearth:         '#3B82F6',
        'hearth-glow':  '#2563EB',
        saffron:        '#F2B544',
        moss:           '#2F5D3F',
        'moss-soft':    '#E5F0E8',
        ink:            '#0A0F1C',
        'ink-muted':    '#3D4B6B',
        'ink-subtle':   '#6B7A9A',
        danger:         '#B8341F',
        border:         '#E2E8F0',
        'border-strong':'#CBD5E1',
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'Times New Roman', 'serif'],
        sans:  ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono:  ['JetBrains Mono', 'Courier New', 'Courier', 'monospace'],
      },
      boxShadow: {
        sm:         '0 2px 6px rgba(10,15,28,0.05)',
        md:         '0 4px 12px rgba(10,15,28,0.09)',
        lift:       '0 2px 6px rgba(10,15,28,0.05), 0 12px 32px rgba(10,15,28,0.08)',
        'lift-hover':'0 4px 10px rgba(10,15,28,0.07), 0 20px 44px rgba(10,15,28,0.12)',
        cta:        '0 4px 14px rgba(59,130,246,0.35)',
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
