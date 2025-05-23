import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ebay-blue': '#0064D2',
        'ebay-yellow': '#F5AF02',
        'ebay-red': '#E53238',
        'ebay-green': '#86B817',
        'neon-pink': '#FF10F0',
        'neon-blue': '#00FFF0',
        'dark-purple': '#1A0033',
        'soft-purple': '#6B46C1',
      },
      fontFamily: {
        'display': ['Clash Display', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'pulse-neon': 'pulse-neon 1.5s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #FF10F0, 0 0 10px #FF10F0, 0 0 15px #FF10F0' },
          '100%': { boxShadow: '0 0 10px #00FFF0, 0 0 20px #00FFF0, 0 0 30px #00FFF0' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'pulse-neon': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' }
        }
      }
    },
  },
  plugins: [],
}
export default config