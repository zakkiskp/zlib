import { useState, useEffect } from 'react';

/**
 * Deteksi viewport mobile lewat matchMedia, dipakai untuk kondisional
 * animasi/perilaku yang SENGAJA dibedakan antara mobile & desktop (mis.
 * animasi transisi Login di AuthSplitLayout.jsx).
 *
 * Breakpoint 1023px SENGAJA disamakan dengan breakpoint `lg:` Tailwind
 * yang sudah dipakai AuthSplitLayout untuk sembunyikan panel showcase di
 * kanan — supaya definisi "mobile" konsisten dengan breakpoint yang sudah
 * ada, tidak menambah sumber kebenaran baru.
 */
export default function useIsMobile(breakpoint = 1023) {
    const [isMobile, setIsMobile] = useState(
        typeof window !== 'undefined' ? window.innerWidth <= breakpoint : false,
    );

    useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
        const handler = (e) => setIsMobile(e.matches);
        setIsMobile(mql.matches);

        if (mql.addEventListener) {
            mql.addEventListener('change', handler);
            return () => mql.removeEventListener('change', handler);
        }
        // Fallback Safari lama
        mql.addListener(handler);
        return () => mql.removeListener(handler);
    }, [breakpoint]);

    return isMobile;
}
