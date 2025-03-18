import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      keyframes: {
        float: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px) rotate(2deg)' },
          '100%': { transform: 'translateY(0px)' },
        },
        pulse: {
          '0%': { transform: 'scale(1)', opacity: '0.2' },
          '50%': { transform: 'scale(1.2)', opacity: '0.4' },
          '100%': { transform: 'scale(1)', opacity: '0.2' },
        }
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        pulse: 'pulse 2s infinite',
      }
    },
  },
  plugins: [],
  safelist: [
    {
      pattern: /./ // This will include all classes
    }
  ]
} satisfies Config;
