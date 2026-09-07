import { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/Components/Navigation/Sidebar';
import BottomNav from '@/Components/Navigation/BottomNav';
import Topbar from '@/Components/Navigation/Topbar';
import { useLanguage } from '@/Contexts/LanguageContext';

/**
 * FIX BUG (i18n menyeluruh — judul halaman di Topbar & tab browser tidak
 * ikut berganti bahasa): SEMUA halaman di app ini mendaftarkan layout-nya
 * lewat pola statis `Page.layout = (page) => <AuthenticatedLayout title="...">`.
 * Fungsi itu didefinisikan DI LUAR komponen React manapun, jadi TIDAK BISA
 * memanggil hook seperti useLanguage()/t() di sana — akibatnya title
 * selalu hardcoded dalam satu bahasa, walau tombol ganti bahasa di navbar
 * ditekan. Solusinya dipindah ke sini: AuthenticatedLayout (yang MEMANG
 * komponen React sungguhan) menerima `titleKey` (bukan teks jadi) lalu
 * me-resolve terjemahannya sendiri lewat useLanguage(). Prop `title` lama
 * masih didukung sebagai fallback (kalau suatu saat ada pemanggil yang
 * sengaja butuh teks dinamis non-key, mis. judul yang sudah berisi nama
 * buku), supaya tidak ada yang patah.
 */
export default function AuthenticatedLayout({ title, titleKey, children }) {
    const { url } = usePage();
    const pathname = url.split('?')[0];
    const { t } = useLanguage();
    const resolvedTitle = titleKey ? t(titleKey) : title;

    const [collapsed, setCollapsed] = useState(() => {
        if (typeof window === 'undefined') return false;
        return localStorage.getItem('zlib-sidebar-collapsed') === '1';
    });

    useEffect(() => {
        localStorage.setItem('zlib-sidebar-collapsed', collapsed ? '1' : '0');
    }, [collapsed]);

    return (
        <div className="min-h-screen bg-base">
            <Head title={resolvedTitle} />

            <Sidebar collapsed={collapsed} onToggleCollapsed={() => setCollapsed((v) => !v)} />

            <div
                className={`flex min-h-screen flex-col transition-[padding-left] duration-300 ${
                    collapsed ? 'lg:pl-[76px]' : 'lg:pl-[264px]'
                }`}
            >
                <Topbar title={resolvedTitle} />
                {/*
                  FIX BUG (halaman Admin System Audit Log & Reports meluber
                  horizontal di mobile): tambahan `overflow-x-hidden` di
                  sini adalah pengaman lapis kedua untuk SEMUA halaman yang
                  memakai AuthenticatedLayout. Perbaikan utamanya tetap di
                  masing-masing halaman (flex-wrap pada filter tanggal),
                  tapi baris ini memastikan kalau ada elemen lain yang lolos
                  menghitung lebar dengan salah, dampaknya cuma terpotong
                  rapi di dalam <main> ini — bukan mendorong seluruh body
                  jadi bisa di-scroll horizontal. Tabel yang memang sengaja
                  butuh scroll ke samping tetap jalan normal karena
                  scroll-nya ada di div overflow-x-auto miliknya sendiri,
                  bukan di sini.
                */}
                <main className="flex-1 overflow-x-hidden px-4 py-6 pb-24 lg:px-6 lg:pb-6">
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
