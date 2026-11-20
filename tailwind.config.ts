import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        /* ── Brand-aware gray scales ──
           The codebase uses zinc-* and neutral-* extensively in inline
           Tailwind classes. These overrides tint the grays slightly warm
           to match the teal/coral personality without rewriting every file. */
        zinc: {
          50:  '#f8f9fa',
          100: '#f1f3f5',
          200: '#e2e5ea',
          300: '#c9ced6',
          400: '#8e97a7',
          500: '#64708a',
          600: '#4a5568',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#0a0f1a'
        },
        neutral: {
          50:  '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712'
        },
        /* Coral/orange highlight accent */
        highlight: {
          DEFAULT: 'hsl(var(--highlight))',
          foreground: 'hsl(var(--highlight-foreground))',
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
        },
        /* Teal primary as a numeric scale for direct use */
        teal: {
          50:  '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        /* Tutor purple accent */
        tutor: {
          DEFAULT: 'hsl(var(--tutor))',
          foreground: 'hsl(var(--tutor-foreground))',
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        /* ── Pastel tile palette (design v2) ──
           Content tiles rotate through these; text on them stays ink. */
        ink: { DEFAULT: '#121216', 2: '#2E2F38', soft: '#25262D' },
        frame: '#DCE0EA',
        soft: '#F4F5F9',
        peri: { DEFAULT: '#9CB3FB', deep: '#7B97F4', soft: '#E1E8FE' },
        lilac: { DEFAULT: '#E7A3F2', soft: '#F5E0F9' },
        peach: { DEFAULT: '#F4973A', soft: '#FDE6CF' },
        mint: { DEFAULT: '#BDEDC9', soft: '#E3F8E8', deep: '#1D7340' },
        sun: { DEFAULT: '#FBE2A0', soft: '#FEF3D6' },
        aqua: { DEFAULT: '#CBEEF6', soft: '#E6F7FB' },
        /* Semantic tokens from CSS variables */
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))'
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))'
        },
      },
      borderRadius: {
        'sm': '0.625rem',
        'md': '0.75rem',
        'lg': 'var(--radius)',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
      },
      boxShadow: {
        'card': '0 1px 2px rgba(18,18,22,0.04)',
        'card-hover': '0 18px 40px -20px rgba(18,18,22,0.28)',
        'elevated': '0 8px 24px -12px rgba(18,18,22,0.18)',
        'float': '0 24px 48px -24px rgba(18,18,22,0.30)',
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['clamp(2.5rem, 5.4vw, 4.75rem)', { lineHeight: '1.02', fontWeight: '500', letterSpacing: '-0.035em' }],
        'display-sm': ['clamp(2rem, 3.4vw, 2.875rem)', { lineHeight: '1.08', fontWeight: '500', letterSpacing: '-0.028em' }],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'marquee': {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap)))" },
        },
        "marquee-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(calc(-100% - var(--gap)))" },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(16px)' },
          to: { opacity: '1', transform: 'translateX(0)' }
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' }
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        "marquee": "marquee var(--duration) linear infinite",
        "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
        'fade-in': 'fade-in 0.4s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'shimmer': 'shimmer 2s ease-in-out infinite',
      },
      maxWidth: {
        'content': '1280px',
      }
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
} satisfies Config

export default config