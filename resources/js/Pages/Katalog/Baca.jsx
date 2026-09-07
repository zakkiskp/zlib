import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import PdfReaderPanel from '@/Components/Katalog/PdfReaderPanel';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { useLanguage } from '@/Contexts/LanguageContext';

/**
 * Sengaja TIDAK pakai AuthenticatedLayout — ini halaman full-screen terpisah
 * (bukan modal lagi) sesuai revisi: buka PDF harus penuh layar, bukan
 * kecil terkurung di dalam modal.
 */
export default function Baca({ buku, halamanTerakhir, catatanBacaan }) {
    const { t } = useLanguage();

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-base">
            <Head title={t('katalog.baca.title', { judul: buku.judul_buku })} />

            <div className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-surface px-4">
                <Link href="/katalog" prefetch className="flex shrink-0 items-center gap-1.5 text-sm text-muted hover:text-ink">
                    <ArrowLeft size={16} />
                    {/* FIX (tombol bahasa di reader butuh ruang): label teks
                        disembunyikan di layar paling sempit, ikon panah saja
                        tetap jadi affordance "kembali" yang jelas. */}
                    <span className="hidden sm:inline">{t('katalog.baca.backToCatalog')}</span>
                </Link>
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{buku.judul_buku}</span>
                {/* FIX (tombol ganti bahasa di reader): sebelumnya halaman
                    baca full-screen ini terpisah dari AuthenticatedLayout,
                    jadi tidak mewarisi LanguageSwitcher dari Topbar sama
                    sekali — pengguna terjebak tanpa cara ganti bahasa
                    selama membaca. Sekarang ditambahkan langsung di sini. */}
                <LanguageSwitcher />
            </div>

            <PdfReaderPanel buku={buku} halamanTerakhir={halamanTerakhir} catatanBacaan={catatanBacaan} />
        </div>
    );
}
