import { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/Components/Navigation/Sidebar';
import BottomNav from '@/Components/Navigation/BottomNav';
import Topbar from '@/Components/Navigation/Topbar';

export default function AuthenticatedLayout({ title, children }) {
    const { url } = usePage();
    // PENTING: key animasi cuma dari pathname (tanpa query string).
    // Sebelumnya pakai `url` penuh — akibatnya tiap ketik di search box
    // (yang ubah ?q=...) dianggap "halaman baru" dan seluruh konten
    // di-remount, termasuk kotak search-nya sendiri (jadi kehilangan fokus).
    const pathname = url.split('?')[0];

    const [collapsed, setCollapsed] = useState(() => {
        if (typeof window === 'undefined') return false;
        return localStorage.getItem('zlib-sidebar-collapsed') === '1';
    });

    useEffect(() => {
        localStorage.setItem('zlib-sidebar-collapsed', collapsed ? '1' : '0');
    }, [collapsed]);

    return (
        <div className="min-h-screen bg-base">
            <Head title={title} />

            <Sidebar collapsed={collapsed} onToggleCollapsed={() => setCollapsed((v) => !v)} />

            <div
                className={`flex min-h-screen flex-col transition-[padding-left] duration-300 ${
                    collapsed ? 'lg:pl-[76px]' : 'lg:pl-[264px]'
                }`}
            >
                <Topbar title={title} />
                <main className="flex-1 px-4 py-6 pb-24 lg:px-6 lg:pb-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            <BottomNav />
        </div>
    );
}
