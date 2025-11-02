import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { getVariantClasses } from "./theme";

/**
 * Utility function to merge Tailwind classes with clsx and tailwind-merge
 * Ensures no conflicting classes and proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Hook to get variant classes for components
 * Provides type-safe access to component variants
 */
export function useVariantClasses() {
  return {
    button: getVariantClasses.button,
    input: getVariantClasses.input,
    card: getVariantClasses.card,
  };
}

/**
 * Utility to create focus-visible styles for accessibility
 */
export function getFocusStyles(color: string = 'primary-500') {
  return `
    focus-visible:outline-none
  `;
}

/**
 * Utility to create hover and active states for interactive elements
 */
export function getInteractiveStyles(variant: 'glow' | 'scale' = 'scale') {
  const styles = {
    glow: 'hover:shadow-lg hover:shadow-primary-500/25 active:shadow-md active:shadow-primary-500/10 transition-shadow duration-100',
    scale: '', // Remove scaling effect to prevent flash
  };

  return styles[variant];
}

/**
 * Utility to create consistent loading spinner styles
 */
export function getLoadingStyles(size: 'sm' | 'md' | 'lg' = 'md') {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return `${sizes[size]} animate-spin rounded-full border-2 border-neutral-300 border-t-primary-500`;
}

/**
 * Utility to create icon button styles
 */
export function getIconButtonStyles(size: 'sm' | 'md' | 'lg' = 'md') {
  const sizes = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
  };

  return `
    ${sizes[size]} rounded-md
    text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100
    active:bg-neutral-200 active:scale-95
    focus-visible:outline-none
    disabled:text-neutral-400 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-neutral-400
    dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800
    dark:active:bg-neutral-700 dark:disabled:text-neutral-600
    transition-all duration-75 ease-out
  `;
}

/**
 * Utility to create form field wrapper styles
 */
export function getFormFieldStyles(hasError: boolean = false) {
  const base = `
    space-y-1.5
    [&>label]:text-sm [&>label]:font-medium [&>label]:text-neutral-700
    [&>label]:dark:text-neutral-300
    [&>.error-message]:text-sm [&>.error-message]:text-destructive-600
    [&>.error-message]:dark:text-destructive-400
  `;

  return hasError ? `${base} [&>input]:border-destructive-300 [&>input]:focus:border-destructive-500` : base;
}

/**
 * Utility to create modal backdrop styles
 */
export function getModalBackdropStyles() {
  return `
    fixed inset-0 z-50
    bg-black/50 backdrop-blur-sm
    animate-in fade-in-0 duration-200
    dark:bg-black/70
  `;
}

/**
 * Utility to create modal content styles
 */
export function getModalContentStyles() {
  return `
    fixed left-[50%] top-[50%] z-50 w-[calc(100%-2rem)] max-w-lg
    translate-x-[-50%] translate-y-[-50%] gap-4 border
    bg-white p-6 shadow-lg duration-200 rounded-lg
    animate-in fade-in-0 zoom-in-95 duration-200
    border-neutral-200 dark:bg-neutral-900 dark:border-neutral-700
    sm:w-[calc(100%-3rem)] md:w-[calc(100%-4rem)] lg:max-w-lg
  `;
}

/**
 * Utility to create tooltip styles
 */
export function getTooltipStyles() {
  return `
    z-50 px-2 py-1 text-xs font-medium
    bg-neutral-900 text-white rounded-md shadow-lg
    animate-in fade-in-0 zoom-in-95 duration-200
    dark:bg-neutral-100 dark:text-neutral-900
  `;
}

/**
 * Utility to create badge styles
 */
export function getBadgeStyles(variant: 'default' | 'secondary' | 'destructive' | 'success' | 'warning' = 'default') {
  const variants = {
    default: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200',
    secondary: 'bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-100',
    destructive: 'bg-destructive-100 text-destructive-700 dark:bg-destructive-900 dark:text-destructive-300',
    success: 'bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-300',
    warning: 'bg-warning-100 text-warning-700 dark:bg-warning-900 dark:text-warning-300',
  };

  return `
    inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full
    ${variants[variant]}
  `;
}

/**
 * Utility to create table row styles with zebra striping
 */
export function getTableRowStyles(index: number, isHoverable: boolean = true) {
  const zebra = index % 2 === 0
    ? 'bg-white dark:bg-neutral-900'
    : 'bg-neutral-50 dark:bg-neutral-800/50';

  const hover = isHoverable
    ? 'hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors duration-75'
    : '';

  return `${zebra} ${hover}`;
}

/**
 * Utility to create skeleton loading styles
 */
export function getSkeletonStyles() {
  return `
    animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-700
  `;
}

/**
 * Utility to create consistent spacing for component sections
 */
export function getSectionSpacing(size: 'sm' | 'md' | 'lg' = 'md') {
  const sizes = {
    sm: 'space-y-3',
    md: 'space-y-4',
    lg: 'space-y-6',
  };

  return sizes[size];
}

/**
 * Type definitions for component variants
 */
export type ButtonVariant = keyof typeof getVariantClasses.button;
export type InputVariant = keyof typeof getVariantClasses.input;
export type CardVariant = keyof typeof getVariantClasses.card;

export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
