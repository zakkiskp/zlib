import './bootstrap';
import './echo';
import '../css/app.css';

import '@fontsource/geist-sans/400.css';
import '@fontsource/geist-sans/500.css';
import '@fontsource/geist-sans/600.css';
import '@fontsource/geist-sans/700.css';
import '@fontsource/geist-mono/400.css';
import '@fontsource/geist-mono/500.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@/Hooks/useTheme';
import { LanguageProvider } from '@/Contexts/LanguageContext'; // <-- 1. Tambahkan import ini

const appName = import.meta.env.VITE_APP_NAME || 'Zlib';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ThemeProvider>
                <LanguageProvider> {/* <-- 2. Bungkus App dengan LanguageProvider */}
                    <App {...props} />
                </LanguageProvider>
            </ThemeProvider>,
        );
    },
    progress: false,
});