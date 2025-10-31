// Design System Tokens and Utilities
// Core design language for consistent, elegant UI components

export const designTokens = {
  // Color Palette - Modern, accessible color system
  colors: {
    // Primary Brand Colors
    primary: {
      50: 'hsl(var(--primary-50) / <alpha-value>)',
      100: 'hsl(var(--primary-100) / <alpha-value>)',
      200: 'hsl(var(--primary-200) / <alpha-value>)',
      300: 'hsl(var(--primary-300) / <alpha-value>)',
      400: 'hsl(var(--primary-400) / <alpha-value>)',
      500: 'hsl(var(--primary-500) / <alpha-value>)',
      600: 'hsl(var(--primary-600) / <alpha-value>)',
      700: 'hsl(var(--primary-700) / <alpha-value>)',
      800: 'hsl(var(--primary-800) / <alpha-value>)',
      900: 'hsl(var(--primary-900) / <alpha-value>)',
    },
    // Semantic Colors
    success: {
      50: 'hsl(var(--success-50) / <alpha-value>)',
      100: 'hsl(var(--success-100) / <alpha-value>)',
      500: 'hsl(var(--success-500) / <alpha-value>)',
      600: 'hsl(var(--success-600) / <alpha-value>)',
      700: 'hsl(var(--success-700) / <alpha-value>)',
    },
    warning: {
      50: 'hsl(var(--warning-50) / <alpha-value>)',
      100: 'hsl(var(--warning-100) / <alpha-value>)',
      500: 'hsl(var(--warning-500) / <alpha-value>)',
      600: 'hsl(var(--warning-600) / <alpha-value>)',
      700: 'hsl(var(--warning-700) / <alpha-value>)',
    },
    destructive: {
      50: 'hsl(var(--destructive-50) / <alpha-value>)',
      100: 'hsl(var(--destructive-100) / <alpha-value>)',
      500: 'hsl(var(--destructive-500) / <alpha-value>)',
      600: 'hsl(var(--destructive-600) / <alpha-value>)',
      700: 'hsl(var(--destructive-700) / <alpha-value>)',
    },
    // Neutral Colors
    neutral: {
      50: 'hsl(var(--neutral-50) / <alpha-value>)',
      100: 'hsl(var(--neutral-100) / <alpha-value>)',
      200: 'hsl(var(--neutral-200) / <alpha-value>)',
      300: 'hsl(var(--neutral-300) / <alpha-value>)',
      400: 'hsl(var(--neutral-400) / <alpha-value>)',
      500: 'hsl(var(--neutral-500) / <alpha-value>)',
      600: 'hsl(var(--neutral-600) / <alpha-value>)',
      700: 'hsl(var(--neutral-700) / <alpha-value>)',
      800: 'hsl(var(--neutral-800) / <alpha-value>)',
      900: 'hsl(var(--neutral-900) / <alpha-value>)',
    },
  },

  // Typography Scale
  typography: {
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },

  // Spacing Scale (rem-based)
  spacing: {
    0: '0',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    DEFAULT: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },

  // Shadows
  shadows: {
    none: 'none',
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  },

  // Transitions
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: '400ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

// Component-specific design tokens
export const componentTokens = {
  button: {
    height: {
      xs: '1.75rem', // 28px
      sm: '2rem',    // 32px
      md: '2.25rem', // 36px
      lg: '2.5rem',  // 40px
      xl: '3rem',    // 48px
    },
    padding: {
      xs: '0.5rem 0.75rem',
      sm: '0.5rem 1rem',
      md: '0.625rem 1.25rem',
      lg: '0.75rem 1.5rem',
      xl: '0.875rem 2rem',
    },
  },

  input: {
    height: {
      sm: '2rem',    // 32px
      md: '2.25rem', // 36px
      lg: '2.5rem',  // 40px
    },
    padding: {
      sm: '0.5rem 0.75rem',
      md: '0.625rem 1rem',
      lg: '0.75rem 1rem',
    },
  },

  card: {
    padding: {
      sm: '0.75rem',
      md: '1rem',
      lg: '1.25rem',
    },
  },

  modal: {
    backdrop: {
      blur: 'backdrop-blur-sm',
      opacity: 'bg-black/50',
    },
    animation: {
      enter: 'animate-in fade-in-0 zoom-in-95 duration-200',
      exit: 'animate-out fade-out-0 zoom-out-95 duration-150',
    },
  },
} as const;

// Utility functions for consistent styling
export const getVariantClasses = {
  button: {
    primary: `
      bg-primary text-primary-foreground
      active:bg-primary/80 active:scale-[0.98]
      focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
      disabled:bg-neutral-300 disabled:text-neutral-500 disabled:cursor-not-allowed
      dark:disabled:bg-neutral-700 dark:disabled:text-neutral-400
      transition-all duration-200 ease-out
    `,
    secondary: `
      bg-secondary text-secondary-foreground border border-neutral-300
      active:bg-secondary/70 active:scale-[0.98]
      focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
      disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed
      dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-600
      dark:active:bg-neutral-600
      transition-all duration-200 ease-out
    `,
    ghost: `
      text-neutral-600
      active:bg-neutral-200 active:scale-[0.98]
      focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
      disabled:text-neutral-400 disabled:cursor-not-allowed
      dark:text-neutral-400 dark:active:bg-neutral-700
      transition-all duration-200 ease-out
    `,
    danger: `
      bg-destructive text-destructive-foreground
      active:bg-destructive/80 active:scale-[0.98]
      focus:ring-2 focus:ring-destructive/50 focus:ring-offset-2
      disabled:bg-neutral-300 disabled:text-neutral-500 disabled:cursor-not-allowed
      dark:disabled:bg-neutral-700 dark:disabled:text-neutral-400
      transition-all duration-200 ease-out
    `,
    success: `
      bg-success text-white
      active:bg-success/80 active:scale-[0.98]
      focus:ring-2 focus:ring-success/50 focus:ring-offset-2
      disabled:bg-neutral-300 disabled:text-neutral-500 disabled:cursor-not-allowed
      dark:disabled:bg-neutral-700 dark:disabled:text-neutral-400
      transition-all duration-200 ease-out
    `,
  },

  input: {
    default: `
      w-full bg-white border border-neutral-300 rounded-md text-neutral-900 placeholder:text-neutral-500
      focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:shadow-lg focus:shadow-primary-500/10
      disabled:bg-neutral-50 disabled:text-neutral-400 disabled:border-neutral-200 disabled:cursor-not-allowed
      dark:bg-neutral-900 dark:border-neutral-600 dark:text-neutral-100 dark:placeholder:text-neutral-400
      dark:focus:border-primary-400 dark:focus:ring-primary-400/20
      dark:disabled:bg-neutral-800 dark:disabled:text-neutral-500 dark:disabled:border-neutral-700
      transition-all duration-200 ease-out
    `,
    error: `
      w-full bg-white border border-destructive-300 rounded-md text-neutral-900 placeholder:text-neutral-500
      focus:border-destructive-500 focus:ring-2 focus:ring-destructive-500/20 focus:shadow-lg focus:shadow-destructive-500/10
      dark:bg-neutral-900 dark:border-destructive-600 dark:text-neutral-100 dark:placeholder:text-neutral-400
      dark:focus:border-destructive-400 dark:focus:ring-destructive-400/20
      transition-all duration-200 ease-out
    `,
  },

  card: {
    default: `
      bg-white border border-neutral-200 rounded-lg shadow-sm
      dark:bg-neutral-900 dark:border-neutral-700
    `,
    elevated: `
      bg-white border border-neutral-200 rounded-lg shadow-lg
      dark:bg-neutral-900 dark:border-neutral-700
    `,
  },
} as const;

// Animation utilities
export const animations = {
  glow: 'shadow-lg shadow-primary-500/25 dark:shadow-primary-400/25',
  scale: 'active:scale-[0.98] transition-transform duration-150',
} as const;

// Accessibility utilities
export const a11y = {
  focus: 'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
  srOnly: 'sr-only',
  reducedMotion: 'motion-reduce:transition-none motion-reduce:animate-none',
} as const;

// Export types for TypeScript
export type ColorToken = keyof typeof designTokens.colors;
export type SpacingToken = keyof typeof designTokens.spacing;
export type BorderRadiusToken = keyof typeof designTokens.borderRadius;
export type ShadowToken = keyof typeof designTokens.shadows;
