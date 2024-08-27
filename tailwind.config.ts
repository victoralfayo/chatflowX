/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        'jade': {
          '50': '#effef7',
          '100': '#dafeef',
          '200': '#b8fadd',
          '300': '#81f4c3',
          '400': '#43e5a0',
          '500': '#1acd81',
          '600': '#0fa968',
          '700': '#108554',
          '800': '#126945',
          '900': '#11563a',
          '950': '#03301f',
        },
        'breaker-bay': {
          '50': '#f3faf9',
          '100': '#d8efed',
          '200': '#b1deda',
          '300': '#83c5c2',
          '400': '#59a8a7',
          '500': '#439696',
          '600': '#307071',
          '700': '#2a5a5b',
          '800': '#25494a',
          '900': '#223e3f',
          '950': '#0f2324',
        },
        'cerulean-blue': {
          '50': '#f0f7fe',
          '100': '#deecfb',
          '200': '#c5dff8',
          '300': '#9dcbf3',
          '400': '#6eaeec',
          '500': '#4c8fe5',
          '600': '#3774d9',
          '700': '#2c5bbe',
          '800': '#2b4ea2',
          '900': '#284480',
          '950': '#1d2b4e',
        },
        'lightning-yellow': {
          '50': '#fefbec',
          '100': '#fcf2c9',
          '200': '#f9e38e',
          '300': '#f6cf53',
          '400': '#f4be38',
          '500': '#ed9a13',
          '600': '#d1740e',
          '700': '#ae530f',
          '800': '#8d4013',
          '900': '#743513',
          '950': '#431a05',
        },

        'energy-yellow': {
          '50': '#fffbeb',
          '100': '#fff3c6',
          '200': '#fee06d',
          '300': '#fed34b',
          '400': '#fdbe22',
          '500': '#f79d09',
          '600': '#db7604',
          '700': '#b65207',
          '800': '#933f0d',
          '900': '#79340e',
          '950': '#461a02',
        },
        'tall-poppy': {
          '50': '#fdf3f3',
          '100': '#fce4e4',
          '200': '#facece',
          '300': '#f5acad',
          '400': '#ee7b7c',
          '500': '#e25152',
          '600': '#ce3435',
          '700': '#b52a2b',
          '800': '#8f2526',
          '900': '#772526',
          '950': '#400f0f',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}