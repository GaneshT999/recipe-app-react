/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          // Reference CSS variables directly here
          primary: 'var(--color-primary)',
          'primary-dark': 'var(--color-primary-dark)',
          'secondary-btn': 'var(--color-secondary-btn)',
          'secondary-btn-dark': 'var(--color-secondary-btn-dark)',
          'background-light': 'var(--color-background-light)',
          'surface-card': 'var(--color-surface-card)',
          'text-default': 'var(--color-text-default)',
          'text-secondary': 'var(--color-text-secondary)',
          'border-light': 'var(--color-border-light)',
          'error-red': 'var(--color-error-red)',
        },
        fontFamily: {
          // Reference CSS variable for font-family
          sans: 'var(--font-inter)',
        },
        boxShadow: {
          'soft-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        }
      },
    },
    plugins: [],
  }