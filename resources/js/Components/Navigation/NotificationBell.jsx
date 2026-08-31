import { useState, useRef, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CircleCheck, Clock3, Banknote, Megaphone, RefreshCw, Info } from 'lucide-react';
import { useLanguage } from '@/Contexts/LanguageContext';

const ICON_BY_TYPE = {
    jatuh_tempo: Clock3,
    approval: CircleCheck,
    denda: Banknote,
    pengumuman: Megaphone,
    perpanjangan: RefreshCw,
    info: Info,
};

export default function NotificationBell() {
    const { props } = usePage();
    const { t } = useLanguage();
    const userId = props.auth?.user?.id;

    // Pastikan props.notifikasi aman dan berupa array sebelum di-assign ke state
    const initialNotifikasi = Array.isArray(props.notifikasi) ? props.notifikasi : [];

    const [notifications, setNotifications] = useState(initialNotifikasi);
    const [unreadCount, setUnreadCount] = useState(props.notifikasiBelumDibaca ?? 0);
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    // Sinkron ulang tiap kali props dari server berubah dengan pengaman array
    useEffect(() => {
        setNotifications(Array.isArray(props.notifikasi) ? props.notifikasi : []);
        setUnreadCount(props.notifikasiBelumDibaca ?? 0);
    }, [props.notifikasi, props.notifikasiBelumDibaca]);

    // Live update lewat Reverb — notifikasi baru langsung nongol tanpa refresh
    useEffect(() => {
        if (!userId || !window.Echo) return;

        const channel = window.Echo.private(`notifikasi.${userId}`);
        channel.listen('.notifikasi.baru', (payload) => {
            setNotifications((prev) => [payload, ...(Array.isArray(prev) ? prev : [])].slice(0, 10));
            setUnreadCount((prev) => prev + 1);
        });

        return () => {
            window.Echo.leave(`notifikasi.${userId}`);
        };
    }, [userId]);

    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAllRead = () => {
        setNotifications((prev) => (Array.isArray(prev) ? prev.map((n) => ({ ...n, is_read: true })) : []));
        setUnreadCount(0);
        router.post('/notifikasi/tandai-semua', {}, { preserveScroll: true, preserveState: true });
    };

    // Pastikan variabel aman untuk di-mapping
    const safeNotifications = Array.isArray(notifications) ? notifications : [];

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen((v) => !v)}
                aria-label={t('notification.title')}
                className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-surface2 hover:text-ink"
            >
                <Bell size={18} />
                {unreadCount > 0 && (
                    <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                    </span>
                )}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.14 }}
                        className="absolute right-0 mt-2 w-80 overflow-hidden rounded-xl border border-border bg-surface/95 shadow-soft backdrop-blur-md z-50"
                    >
                        <div className="flex items-center justify-between border-b border-border px-4 py-3">
                            <p className="text-sm font-semibold text-ink">{t('notification.title')}</p>
                            {unreadCount > 0 && (
                                <button onClick={markAllRead} className="text-xs font-medium text-accent hover:underline">
                                    {t('notification.markAllRead')}
                                </button>
                            )}
                        </div>

                        <div className="max-h-80 overflow-y-auto">
                            {safeNotifications.length === 0 ? (
                                <p className="px-4 py-8 text-center text-sm text-muted">{t('notification.empty')}</p>
                            ) : (
                                safeNotifications.map((n) => {
                                    const NIcon = ICON_BY_TYPE[n.tipe] ?? Info;
                                    return (
                                        <div
                                            key={n.id}
                                            className={`flex gap-3 border-b border-border/60 px-4 py-3 last:border-0 ${
                                                !n.is_read ? 'bg-accent/[0.04]' : ''
                                            }`}
                                        >
                                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface2 text-muted">
                                                <NIcon size={15} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-ink">{n.judul}</p>
                                                <p className="mt-0.5 line-clamp-2 text-xs text-muted">{n.pesan}</p>
                                                <p className="mt-1 text-[11px] text-muted/70">{n.waktu}</p>
                                            </div>
                                            {!n.is_read && (
                                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        <Link
                            href="/notifikasi"
                            prefetch
                            className="block border-t border-border px-4 py-2.5 text-center text-xs font-medium text-accent hover:bg-surface2"
                        >
                            {t('notification.viewAll')}
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}