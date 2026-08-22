import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

const ACCENTS = ['emerald', 'indigo', 'violet', 'amber'];

export function ThemeProvider({ children }) {
    const [mode, setMode] = useState(() => {
        if (typeof window === 'undefined') return 'dark';
        return localStorage.getItem('zlib-theme-mode') || 'dark';
    });

    const [accent, setAccent] = useState(() => {
        if (typeof window === 'undefined') return 'emerald';
        return localStorage.getItem('zlib-theme-accent') || 'emerald';
    });

    // Sinkronkan class `dark` di <html> setiap mode berubah
    useEffect(() => {
        document.documentElement.classList.toggle('dark', mode === 'dark');
        localStorage.setItem('zlib-theme-mode', mode);
    }, [mode]);

    // Sinkronkan attribute data-accent di <html> setiap accent berubah
    useEffect(() => {
        document.documentElement.setAttribute('data-accent', accent);
        localStorage.setItem('zlib-theme-accent', accent);
    }, [accent]);

    const toggleMode = () => setMode((m) => (m === 'dark' ? 'light' : 'dark'));

    const value = { mode, setMode, toggleMode, accent, setAccent, accents: ACCENTS };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error('useTheme() harus dipakai di dalam <ThemeProvider>');
    }
    return ctx;
}
