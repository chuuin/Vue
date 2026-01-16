module.exports = {
  content: ['./index.html', './src/**/*.{vue,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#0b0f1a',
          800: '#111827',
          700: '#1f2937'
        },
        brand: {
          500: '#22d3ee',
          600: '#0891b2',
          700: '#0e7490'
        },
        ember: {
          500: '#f97316',
          600: '#ea580c'
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'sans-serif']
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(34, 211, 238, 0.3), 0 10px 30px rgba(15, 23, 42, 0.6)'
      }
    }
  },
  plugins: []
}
