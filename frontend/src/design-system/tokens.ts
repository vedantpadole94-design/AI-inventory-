/**
 * ═══════════════════════════════════════════════════════════════════
 * FILE: src/design-system/tokens.ts
 * ═══════════════════════════════════════════════════════════════════
 * 
 * PURPOSE:
 * Central repository of design tokens (colors, typography, spacing,
 * radii, shadows) for SmartProcure AI.
 * 
 * WHY THIS EXISTS:
 * Guarantees visual consistency across all components and domain views.
 * Prevents magic values, promotes WCAG AAA contrast compliance, and
 * standardizes the refined Linear/Vercel/Stripe enterprise aesthetic.
 * 
 * USED BY:
 * - All UI primitives in `src/design-system/components/`
 * - Charts in `src/design-system/charts/`
 * - Layout components (`Sidebar.tsx`, `TopBar.tsx`, `AppShell.tsx`)
 * - Domain views across `src/pages/`
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

export const tokens = {
  colors: {
    neutrals: {
      bgCanvas: '#FAFAF9',
      bgSurface: '#FFFFFF',
      bgSubtle: '#F5F5F4',
      bgMuted: '#E7E5E4',
      borderDefault: '#E7E5E4',
      borderStrong: '#D6D3D1',
      textPrimary: '#18181B',
      textSecondary: '#52525B',
      textTertiary: '#71717A',
      textDisabled: '#A1A1AA',
    },
    brand: {
      primary: '#4F46E5',    // Indigo 600 - High-precision SaaS accent
      hover: '#4338CA',      // Indigo 700
      subtle: '#EEF2FF',     // Indigo 50
      glow: '#6366F1',       // Indigo 500 - for subtle focus rings
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
    semantic: {
      success: '#15803D',
      successBg: '#F0FDF4',
      warning: '#B45309',
      warningBg: '#FFFBEB',
      danger: '#B91C1C',
      dangerBg: '#FEF2F2',
      info: '#0E7490',
      infoBg: '#ECFEFF',
    },
    chart: [
      '#4F46E5', // Indigo
      '#0D9488', // Teal
      '#059669', // Emerald
      '#D97706', // Amber
      '#E11D48', // Rose
      '#7C3AED', // Violet
      '#2563EB', // Blue
      '#DB2777', // Pink
      '#6366F1', // Indigo-light
      '#0891B2', // Cyan
    ],
  },
  typography: {
    fonts: {
      primary: '"Inter", system-ui, -apple-system, sans-serif',
      mono: '"JetBrains Mono", monospace',
    },
    scale: {
      display: 'text-[32px] leading-[40px] tracking-[-0.02em] font-semibold',
      h1: 'text-[24px] leading-[32px] tracking-[-0.01em] font-semibold',
      h2: 'text-[20px] leading-[28px] tracking-[-0.01em] font-semibold',
      h3: 'text-[16px] leading-[24px] font-semibold',
      body: 'text-[14px] leading-[20px] font-normal',
      bodyStrong: 'text-[14px] leading-[20px] font-medium',
      small: 'text-[13px] leading-[18px] font-normal',
      caption: 'text-[12px] leading-[16px] tracking-[0.01em] font-medium',
      mono: 'text-[13px] leading-[20px] font-normal font-mono',
    },
  },
  spacing: [4, 8, 12, 16, 20, 24, 32, 40, 48, 64],
  radius: {
    sm: 'rounded-[6px]',
    md: 'rounded-[8px]',
    lg: 'rounded-[12px]',
    xl: 'rounded-[16px]',
  },
  shadows: {
    xs: 'shadow-xs',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  },
} as const;
