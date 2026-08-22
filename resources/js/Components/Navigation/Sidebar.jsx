import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronsLeft, ChevronsRight, LogOut, Library } from 'lucide-react';
import { navigationByRole } from '@/Config/navigation';
import { useLanguage } from '@/Contexts/LanguageContext';
import { resolveMediaUrl } from '@/Utils/ui'; // Impor ini wajib

export default function Sidebar({ collapsed, onToggleCollapsed }) {
    const { url, props } = usePage();
    const user = props.auth?.user;
    const sections = navigationByRole[user?.role] ?? navigationByRole.anggota;
    const { t } = useLanguage();

    return (
        <motion.aside
            animate={{ width: collapsed ? 76 : 264 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-border bg-surface lg:flex"
        >
            <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
                    <Library size={18} strokeWidth={2.25} />
                </div>
                <AnimatePresence initial={false}>
                    {!collapsed && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="whitespace-nowrap text-[15px] font-semibold tracking-tight text-ink"
                        >
                            Zlib
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
                {sections.map((section) => (
                    <div key={section.section}>
                        <AnimatePresence initial={false}>
                            {!collapsed && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="mb-2 px-3 text-[11px] font-medium uppercase tracking-wider text-muted"
                                >
                                    {t(section.sectionKey)}
                                </motion.p>
                            )}
                        </AnimatePresence>
                        <div className="space-y-0.5">
                            {section.items.map((item) => {
                                const active = url.startsWith(item.href);
                                const ItemIcon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        prefetch
                                        className={`relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                            active ? 'text-accent' : 'text-muted hover:bg-surface2 hover:text-ink'
                                        }`}
                                    >
                                        {active && (
                                            <motion.span
                                                layoutId="sidebar-active-pill"
                                                className="absolute inset-0 rounded-lg bg-accent/10 ring-1 ring-accent/20"
                                                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                            />
                                        )}
                                        <ItemIcon size={18} strokeWidth={2} className="relative shrink-0" />
                                        <AnimatePresence initial={false}>
                                            {!collapsed && (
                                                <motion.span
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="relative truncate"
                                                >
                                                    {t(item.labelKey)}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="space-y-1 border-t border-border p-3">
                <div className="flex items-center gap-3 rounded-lg px-2 py-2">
                    <img
                        src={resolveMediaUrl(user?.avatar_url)} // DI SINI PERBAIKANNYA
                        alt={user?.name}
                        className="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-border"
                    />
                    {!collapsed && (
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-ink">{user?.name}</p>
                            <p className="truncate text-xs capitalize text-muted">{user?.role}</p>
                        </div>
                    )}
                </div>
                <button
                    onClick={onToggleCollapsed}
                    className="flex w-full items-center justify-center rounded-lg px-3 py-2 text-muted hover:bg-surface2 hover:text-ink"
                >
                    {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
                </button>
            </div>
        </motion.aside>
    );
}