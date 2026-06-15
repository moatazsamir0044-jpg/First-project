import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        orange: { DEFAULT: '#f4603d', dk: '#dd4f2e' },
        green: { DEFAULT: '#237c58', dk: '#1b6044' },
        cream: '#efe8e1',
        ink: '#292a2b',
        sky: '#c9e1ea',
      },
      fontFamily: {
        heading: ['Recoleta', 'Georgia', 'serif'],
        body: ['Gilroy', 'system-ui', 'sans-serif'],
        sans: ['Gilroy', 'system-ui', 'sans-serif'],
      },
      maxWidth: { site: '1240px' },
      borderRadius: {
        card: '16px',
        btn: '12px',
        pill: '999px',
      },
    },
  },
  plugins: [],
}
export default config
