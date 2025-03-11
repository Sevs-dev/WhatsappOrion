import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'toast-in-out': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '10%': { transform: 'translateY(0)', opacity: '1' },
          '90%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-100%)', opacity: '0' },
        },
        progress: {
          '0%': { width: '100%' },
          '100%': { width: '0%' },
        },
      },
      animation: {
        'toast-in-out': 'toast-in-out 3s ease-in-out forwards',
        'progress': 'progress 3s linear forwards',
      },
    },
  },
  plugins: [],
} satisfies Config;
