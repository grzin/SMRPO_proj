import type { Config } from 'tailwindcss'

export default {
  content: [
    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        900: '#101211',
        800: '#171918',
        700: '#202221',
        600: '#2e3130',
        400: '#dbdbdb',
        300: '#ebebeb',
        200: '#f7f7f7',
        100: '#ffffff',
        accent: '#ffc44d',
        medium: '#ffda8f',
        light: '#fff0d1',
      },
    },
  },
  plugins: [],
} satisfies Config
