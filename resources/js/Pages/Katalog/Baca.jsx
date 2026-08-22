import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import PdfReaderPanel from '@/Components/Katalog/PdfReaderPanel';

/**
 * Sengaja TIDAK pakai AuthenticatedLayout — ini halaman full-screen terpisah
 * (bukan modal lagi) sesuai revisi: buka PDF harus penuh layar, bukan
 * kecil terkurung di dalam modal.
 */
export default function Baca({ buku, halamanTerakhir, catatanBacaan }) {
    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-base">
            <Head title={`Baca — ${buku.judul_buku}`} />

            <div className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-surface px-4">
                <Link href="/katalog" prefetch className="flex shrink-0 items-center gap-1.5 text-sm text-muted hover:text-ink">
                    <ArrowLeft size={16} /> Kembali ke Katalog
                </Link>
                <span className="min-w-0 truncate text-sm font-medium text-ink">{buku.judul_buku}</span>
            </div>

            <PdfReaderPanel buku={buku} halamanTerakhir={halamanTerakhir} catatanBacaan={catatanBacaan} />
        </div>
    );
}
