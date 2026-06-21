import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#FAFAFA',
          soft: '#F4F4F5',
          elevated: '#FFFFFF',
        },
        ink: {
          DEFAULT: '#18181B',
          soft: '#3F3F46',
          muted: '#71717A',
        },
        brand: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          active: '#1E40AF',
          subtle: '#EFF6FF',
        },
        border: {
          subtle: '#E4E4E7',
          strong: '#D4D4D8',
        },
        status: {
          success: '#16A34A',
          processing: '#2563EB',
          alert: '#DC2626',
          neutral: '#71717A',
        },
        // Stitch-inspired colored backgrounds for stat cards
        stat: {
          amber: '#FEF3C7',
          blue: '#DBEAFE',
          emerald: '#D1FAE5',
          slate: '#F1F5F9',
          rose: '#FFE4E6',
        },
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'premium-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'premium-md': '0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
        'premium-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        'premium-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
export default config;
