import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Geist Sans', ...defaultTheme.fontFamily.sans],
                mono: ['Geist Mono', ...defaultTheme.fontFamily.mono],
            },
            colors: {
                // Token elevasi (dipakai untuk dark & light sekaligus lewat CSS variable di app.css)
                base: 'rgb(var(--base) / <alpha-value>)',
                surface: 'rgb(var(--surface) / <alpha-value>)',
                surface2: 'rgb(var(--surface-2) / <alpha-value>)',
                border: 'rgb(var(--border) / <alpha-value>)',
                ink: 'rgb(var(--text-primary) / <alpha-value>)',
                muted: 'rgb(var(--text-secondary) / <alpha-value>)',
                // Accent dinamis: nilainya berubah sesuai [data-accent] terpilih
                accent: {
                    DEFAULT: 'rgb(var(--accent-500) / <alpha-value>)',
                    600: 'rgb(var(--accent-600) / <alpha-value>)',
                },
            },
            boxShadow: {
                soft: '0 1px 2px 0 rgb(0 0 0 / 0.04), 0 8px 24px -8px rgb(0 0 0 / 0.12)',
                'glow-accent': '0 0 0 1px rgb(var(--accent-500) / 0.15), 0 4px 24px -4px rgb(var(--accent-500) / 0.25)',
            },
            keyframes: {
                'fade-in': {
                    '0%': { opacity: 0, transform: 'translateY(4px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
                'pulse-dot': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.4 },
                },
            },
            animation: {
                'fade-in': 'fade-in .18s ease-out',
                'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
            },
        },
    },
    plugins: [forms],
};
