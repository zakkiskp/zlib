import { useState, useRef, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, IdCard, LogOut } from 'lucide-react';
import { resolveMediaUrl } from '@/Utils/ui'; // Impor ini wajib

export default function UserMenu() {
    const { props } = usePage();
    const user = props.auth?.user;
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) return null;

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 hover:bg-surface2"
            >
                <img
                    src={resolveMediaUrl(user.avatar_url)} // DI SINI PERBAIKANNYA
                    alt={user.name}
                    className="h-7 w-7 rounded-full object-cover ring-1 ring-border"
                />
                <ChevronDown size={14} className="hidden text-muted sm:block" />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.14 }}
                        className="absolute right-0 mt-2 w-60 overflow-hidden rounded-xl border border-border bg-surface/95 shadow-soft backdrop-blur-md"
                    >
                        <div className="border-b border-border px-4 py-3">
                            <p className="truncate text-sm font-medium text-ink">{user.name}</p>
                            <p className="truncate text-xs text-muted">{user.email}</p>
                        </div>
                        <div className="p-1.5">
                            <Link href="/profil" className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted hover:bg-surface2 hover:text-ink">
                                <IdCard size={16} /> Profil Saya
                            </Link>
                            <Link href="/logout" method="post" as="button" className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-red-500 hover:bg-red-500/10">
                                <LogOut size={16} /> Keluar
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}