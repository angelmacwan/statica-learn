import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Statica Learn pastel palette (from style guide)
        cream: {
          50: '#fdfaf5',
          100: '#faf4e8',
          200: '#f5e8d0',
        },
        mint: {
          50: '#f0faf6',
          100: '#d4f0e5',
          200: '#a8e0ca',
          300: '#7ccfb0',
          400: '#50be96',
        },
        blush: {
          50: '#fdf2f4',
          100: '#fce4e8',
          200: '#f8c9d2',
          300: '#f4adb9',
        },
        coral: {
          100: '#fde8e2',
          200: '#fad0c5',
          300: '#f7b9a8',
        },
        lavender: {
          100: '#f0eef8',
          200: '#dedad0',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
        mono: ['JetBrains Mono', 'Fira Code', 'Fira Mono', 'monospace'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 2px 16px 0 rgba(0,0,0,0.06)',
        card: '0 4px 24px 0 rgba(0,0,0,0.08)',
        float: '0 8px 40px 0 rgba(0,0,0,0.10)',
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.800'),
            lineHeight: '1.75',
            p: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },
            'p:first-child': {
              marginTop: '0',
            },
            'p:last-child': {
              marginBottom: '0',
            },
            h1: {
              marginTop: '1.75em',
              marginBottom: '0.75em',
            },
            h2: {
              marginTop: '1.6em',
              marginBottom: '0.6em',
            },
            h3: {
              marginTop: '1.4em',
              marginBottom: '0.5em',
            },
            h4: {
              marginTop: '1.2em',
              marginBottom: '0.4em',
            },
            ul: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },
            ol: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },
            li: {
              marginTop: '0.375em',
              marginBottom: '0.375em',
            },
            pre: {
              marginTop: '1.5em',
              marginBottom: '1.5em',
            },
          },
        },
      }),
    },
  },
  plugins: [typography],
};
