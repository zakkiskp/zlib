import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut } from 'lucide-react';
import { bottomNavByRole, navigationByRole } from '@/Config/navigation';
import { useLanguage } from '@/Contexts/LanguageContext';

export default function BottomNav() {
    const { url, props } = usePage();
    const user = props.auth?.user;
    const role = user?.role ?? 'anggota';
    const items = bottomNavByRole[role] ?? bottomNavByRole.anggota;
    const sections = navigationByRole[role] ?? navigationByRole.anggota;
    const [open, setOpen] = useState(false);
    const { t } = useLanguage();

    return (
        <>
            <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
                <div className="grid h-16 grid-cols-5">
                    {items.map((item) => {
                        const active = url.startsWith(item.href);
                        const ItemIcon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                prefetch
                                className="relative flex flex-col items-center justify-center gap-1"
                            >
                                {active && (
                                    <motion.span
                                        layoutId="bottomnav-active-dot"
                                        className="absolute top-1.5 h-1 w-5 rounded-full bg-accent"
                                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                    />
                                )}
                                <ItemIcon
                                    size={20}
                                    strokeWidth={active ? 2.4 : 2}
                                    className={active ? 'text-accent' : 'text-muted'}
                                />
                                <span className={`text-[10.5px] font-medium ${active ? 'text-accent' : 'text-muted'}`}>
                                    {t(item.labelKey)}
                                </span>
                            </Link>
                        );
                    })}

                    <button onClick={() => setOpen(true)} className="flex flex-col items-center justify-center gap-1">
                        <Menu size={20} strokeWidth={2} className="text-muted" />
                        <span className="text-[10.5px] font-medium text-muted">{t('nav.more')}</span>
                    </button>
                </div>
            </nav>

            <AnimatePresence>
                {open && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpen(false)}
                            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
                            className="fixed inset-x-0 bottom-0 z-50 max-h-[75vh] overflow-y-auto rounded-t-2xl border-t border-border bg-surface p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] lg:hidden"
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <p className="text-sm font-semibold text-ink">{t('nav.more.title')}</p>
                                <button
                                    onClick={() => setOpen(false)}
                                    className="rounded-md p-1.5 text-muted hover:bg-surface2"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="space-y-5">
                                {sections.map((section) => (
                                    <div key={section.section}>
                                        <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted">
                                            {t(section.sectionKey)}
                                        </p>
                                        <div className="grid grid-cols-3 gap-2">
                                            {section.items.map((item) => {
                                                const ItemIcon = item.icon;
                                                return (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        prefetch
                                                        onClick={() => setOpen(false)}
                                                        className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-base/40 px-2 py-3 text-center"
                                                    >
                                                        <ItemIcon size={18} className="text-muted" />
                                                        <span className="text-[11px] font-medium leading-tight text-ink">
                                                            {t(item.labelKey)}
                                                        </span>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}

                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-medium text-red-500"
                                >
                                    <LogOut size={16} /> {t('nav.logout')}
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
