import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Check } from 'lucide-react';
import { useTheme } from '@/Hooks/useTheme';
import { useLanguage } from '@/Contexts/LanguageContext';

const ACCENT_META = {
    emerald: { label: 'Emerald', swatch: 'rgb(16 185 129)' },
    indigo: { label: 'Indigo', swatch: 'rgb(99 102 241)' },
    violet: { label: 'Violet', swatch: 'rgb(139 92 246)' },
    amber: { label: 'Amber', swatch: 'rgb(245 158 11)' },
};

export default function ThemeSwitcher() {
    const { mode, setMode, accent, setAccent, accents } = useTheme();
    const { t } = useLanguage();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        // FIX BUG (dropdown tema tenggelam di halaman Login/Register):
        // container ini sebelumnya cuma "relative" tanpa z-index, jadi
        // stacking-context-nya diam di level 0 (auto). Di AuthSplitLayout,
        // wrapper <motion.div> untuk form (title + FloatingInput) yang
        // dirender SESUDAH header di DOM ikut membentuk stacking context
        // sendiri (gara-gara style transform/opacity dari Framer Motion),
        // dan karena urutan DOM-nya lebih akhir, dia otomatis "menang"
        // tampil di atas dropdown ini walau dropdown ini terbuka lebih
        // dulu -> hasilnya dropdown kelihatan "ketutup"/tenggelam di
        // belakang kotak input email/password. Solusinya: kasih z-50
        // eksplisit di container SEKALIGUS di panel dropdown-nya (disamakan
        // dengan pola NotificationBell.jsx yang sudah benar).
        <div className="relative z-50" ref={ref}>
            <button
                onClick={() => setOpen((v) => !v)}
                aria-label={t('common.changeTheme')}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-surface2 hover:text-ink"
            >
                {mode === 'dark' ? <Moon size={17} /> : <Sun size={17} />}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.14 }}
                        className="absolute right-0 z-50 mt-2 w-64 rounded-xl border border-border bg-surface/95 p-3 shadow-soft backdrop-blur-md"
                    >
                        <p className="mb-2 px-1 text-[11px] font-medium uppercase tracking-wider text-muted">
                            {t('common.displayMode')}
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => setMode('light')}
                                className={`flex items-center justify-center gap-2 rounded-lg border py-2 text-sm font-medium transition-colors ${
                                    mode === 'light'
                                        ? 'border-accent/40 bg-accent/10 text-accent'
                                        : 'border-border text-muted hover:text-ink'
                                }`}
                            >
                                <Sun size={15} /> {t('common.light')}
                            </button>
                            <button
                                onClick={() => setMode('dark')}
                                className={`flex items-center justify-center gap-2 rounded-lg border py-2 text-sm font-medium transition-colors ${
                                    mode === 'dark'
                                        ? 'border-accent/40 bg-accent/10 text-accent'
                                        : 'border-border text-muted hover:text-ink'
                                }`}
                            >
                                <Moon size={15} /> {t('common.dark')}
                            </button>
                        </div>

                        <p className="mb-2 mt-4 px-1 text-[11px] font-medium uppercase tracking-wider text-muted">
                            {t('common.accentColor')}
                        </p>
                        <div className="grid grid-cols-4 gap-2">
                            {accents.map((a) => (
                                <button
                                    key={a}
                                    onClick={() => setAccent(a)}
                                    title={ACCENT_META[a].label}
                                    className="flex flex-col items-center gap-1.5 rounded-lg py-2 hover:bg-surface2"
                                >
                                    <span
                                        style={{ backgroundColor: ACCENT_META[a].swatch }}
                                        className={`flex h-6 w-6 items-center justify-center rounded-full ring-2 ring-offset-2 ring-offset-surface transition-shadow ${
                                            accent === a ? 'ring-ink' : 'ring-transparent'
                                        }`}
                                    >
                                        {accent === a && <Check size={12} className="text-white" strokeWidth={3} />}
                                    </span>
                                    <span className="text-[10.5px] text-muted">{ACCENT_META[a].label}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
