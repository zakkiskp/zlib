import { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/Components/Navigation/Sidebar';
import BottomNav from '@/Components/Navigation/BottomNav';
import Topbar from '@/Components/Navigation/Topbar';

export default function AuthenticatedLayout({ title, children }) {
    const { url } = usePage();
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
                    {/*
                      FIX PERFORMA #4 (transisi halaman terasa lambat):
                      - mode="wait" DIHAPUS -> diganti "popLayout". Sebelumnya
                        AnimatePresence menunggu animasi exit kelar dulu baru
                        mulai animasi enter (sequential = 2x durasi terasa).
                        "popLayout" melepas elemen lama dari alur layout
                        SEGERA sehingga elemen baru bisa langsung render/animasi
                        beriringan, bukan bergantian.
                      - initial={false} pada AnimatePresence: halaman PERTAMA
                        kali dibuka (mis. baru login) tidak usah ikut animasi
                        fade-in yang menambah delay yang tidak perlu.
                      - Durasi diperpendek 0.15s -> 0.1s, dan transform y-6
                        dihapus (cukup opacity) supaya browser tidak perlu
                        hitung ulang transform di setiap frame, hasilnya
                        terasa lebih snappy tanpa kehilangan micro-interaction.
                    */}
                    <AnimatePresence mode="popLayout" initial={false}>
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.1, ease: 'easeOut' }}
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
