/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* STRICTLY PRESERVED SAPNA SAREES BRAND PALETTE */
        primary: {
          DEFAULT: '#7A1C2E', // Regal Maroon
          deep: '#5C1220',    // Deep Royal Maroon
          light: '#9E2A3E',
        },
        secondary: {
          DEFAULT: '#C8A96E', // Antique Gold
          light: '#E8D5A3',   // Soft Champagne Gold
          dark: '#A6874E',
        },
        surface: {
          ivory: '#FAF8F5',   // Warm Premium Off-White / Cream
          cream: '#F4EFEA',   // Subtle Atelier Soft Cream
          card: '#FFFFFF',
          blush: '#E8C4B8',   // Soft Bridal Blush
          accent: '#EFE8DF',
        },
        charcoal: {
          DEFAULT: '#2C2420', // Artisan Ink / Primary Typography
          muted: '#7C6E66',   // Warm Stone Gray / Metadata
          light: '#A6988E',
          deep: '#1A1513',
        },
        brandBorder: 'rgba(200, 169, 110, 0.25)',
        brandBorderLight: 'rgba(44, 36, 32, 0.12)',
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Montserrat"', '"Jost"', 'system-ui', 'sans-serif'],
        script: ['"Dancing Script"', 'cursive'],
      },
      letterSpacing: {
        tightest: '-0.03em',
        luxury: '0.18em',
        widest: '0.28em',
        editorial: '0.35em',
      },
      aspectRatio: {
        'portrait': '3/4',
        'editorial': '4/5',
        'tall': '2/3',
      },
      boxShadow: {
        'luxury': '0 10px 40px -15px rgba(122, 28, 46, 0.08)',
        'luxury-hover': '0 25px 60px -15px rgba(44, 36, 32, 0.14)',
        'gold-glow': '0 0 25px rgba(200, 169, 110, 0.2)',
        'card-soft': '0 4px 20px -2px rgba(44, 36, 32, 0.05)',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '700': '700ms',
        '1000': '1000ms',
      },
    },
  },
  plugins: [],
}
