import { colors } from './src/theme/colors.js';
import { spacing } from './src/theme/spacing.js';
import { typography } from './src/theme/typography.js';
import { shadows } from './src/theme/shadows.js';
import { breakpoints } from './src/theme/breakpoints.js';

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    screens: breakpoints,
    extend: {
      colors: {
        brand: colors.primary,
        secondary: colors.secondary,
        accent: colors.accent,
        background: colors.background,
        status: colors.status,
      },
      fontFamily: typography.fontFamily,
      boxShadow: shadows,
      spacing: spacing,
    },
  },
  plugins: [],
};

export default config;
