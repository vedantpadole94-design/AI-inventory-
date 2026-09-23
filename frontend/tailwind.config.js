/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: '#FAFAF9',
        surface: '#FFFFFF',
        subtle: '#F5F5F4',
        muted: '#E7E5E4',
        border: {
          default: '#E7E5E4',
          strong: '#D6D3D1',
        },
        text: {
          primary: '#18181B',
          secondary: '#52525B',
          tertiary: '#71717A',
          disabled: '#A1A1AA',
        },
        accent: {
          primary: '#4F46E5',    // Indigo 600
          hover: '#4338CA',      // Indigo 700
          subtle: '#EEF2FF',     // Indigo 50
          glow: '#6366F1',       // Indigo 500
          light: '#C7D2FE',      // Indigo 200
        },
        feature: {
          dashboard: '#4F46E5',   // Indigo
          suppliers: '#059669',   // Emerald
          orders: '#2563EB',      // Blue
          inventory: '#D97706',   // Amber
          customers: '#DB2777',   // Pink
          analytics: '#0D9488',   // Teal
          forecasting: '#7C3AED', // Violet
          risk: '#E11D48',        // Rose
          copilot: '#6366F1',     // Indigo-light
          settings: '#475569',    // Slate
        },
        domain: {
          teal: '#0D9488',
          'teal-bg': '#F0FDFA',
          violet: '#7C3AED',
          'violet-bg': '#F5F3FF',
          rose: '#E11D48',
          'rose-bg': '#FFF1F2',
          amber: '#D97706',
          'amber-bg': '#FFFBEB',
          emerald: '#059669',
          'emerald-bg': '#ECFDF5',
          sky: '#0284C7',
          'sky-bg': '#F0F9FF',
        },
        semantic: {
          success: '#15803D',
          'success-bg': '#F0FDF4',
          warning: '#B45309',
          'warning-bg': '#FFFBEB',
          danger: '#B91C1C',
          'danger-bg': '#FEF2F2',
          info: '#0E7490',
          'info-bg': '#ECFEFF',
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #EEF2FF 0%, #FAFAF9 60%, #F0FDFA 100%)',
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgb(0 0 0 / 0.04)',
        'sm': '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.04)',
      },
      borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'monospace'],
      },
      fontSize: {
        'display': ['32px', { lineHeight: '40px', letterSpacing: '-0.02em', fontWeight: '600' }],
        'h1': ['24px', { lineHeight: '32px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h2': ['20px', { lineHeight: '28px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h3': ['16px', { lineHeight: '24px', letterSpacing: '0', fontWeight: '600' }],
        'body': ['14px', { lineHeight: '20px', letterSpacing: '0', fontWeight: '400' }],
        'body-strong': ['14px', { lineHeight: '20px', letterSpacing: '0', fontWeight: '500' }],
        'small': ['13px', { lineHeight: '18px', letterSpacing: '0', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '16px', letterSpacing: '0.01em', fontWeight: '500' }],
        'mono': ['13px', { lineHeight: '20px', letterSpacing: '0', fontWeight: '400' }],
      },
    },
  },
  plugins: [],
}
