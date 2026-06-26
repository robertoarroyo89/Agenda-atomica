/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        // SF Pro is loaded via the system font stack in index.css.
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // iOS system tints
        ios: {
          blue: '#0A84FF',
          indigo: '#5E5CE6',
          green: '#30D158',
          orange: '#FF9F0A',
          red: '#FF453A',
          gray: '#8E8E93',
        },
      },
      boxShadow: {
        // Layered depth used to separate frosted surfaces from the background.
        card: '0 8px 32px 0 rgba(0,0,0,0.08)',
        float: '0 12px 40px -8px rgba(0,0,0,0.18)',
        tab: '0 -1px 24px 0 rgba(0,0,0,0.06)',
      },
      backdropBlur: {
        xl: '24px',
        '2xl': '40px',
      },
      transitionTimingFunction: {
        // Apple's standard spring-like easing.
        ios: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
      keyframes: {
        'sheet-up': {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'pop-in': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'sheet-up': 'sheet-up 0.45s cubic-bezier(0.25, 0.1, 0.25, 1)',
        'pop-in': 'pop-in 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
    },
  },
  plugins: [],
}
