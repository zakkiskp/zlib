import { router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BookCover from '@/Components/BookCover';
import StarRating from '@/Components/Katalog/StarRating';
import { Heart } from 'lucide-react';

function KoleksiPribadi({ koleksi }) {
    const hapus = (bukuId) => {
        router.post(`/koleksi-pribadi/${bukuId}/toggle`, {}, { preserveScroll: true });
    };

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-xl font-semibold text-ink">Koleksi Pribadi</h2>
                <p className="text-sm text-muted">Buku-buku yang kamu simpan sebagai favorit.</p>
            </div>

            {koleksi.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-surface/50 p-12 text-center text-sm text-muted">
                    Belum ada buku favorit. Klik ikon hati di Katalog untuk menyimpan buku ke sini.
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                    {koleksi.map((k) => (
                        <div key={k.id}>
                            <Link href="/katalog" className="block">
                                <BookCover
                                    src={k.buku?.cover_url}
                                    alt={k.buku?.judul_buku}
                                    className="aspect-[3/4] rounded-xl shadow-soft"
                                />
                                <p className="mt-2 truncate text-sm font-medium text-ink">{k.buku?.judul_buku}</p>
                                <p className="truncate text-xs text-muted">{k.buku?.penulis}</p>
                                <div className="mt-0.5">
                                    <StarRating rating={k.buku?.rating_rata_rata} size={12} />
                                </div>
                            </Link>
                            <button
                                onClick={() => hapus(k.buku_id)}
                                className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-red-500 hover:underline"
                            >
                                <Heart size={11} className="fill-red-500" /> Hapus dari koleksi
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

KoleksiPribadi.layout = (page) => <AuthenticatedLayout title="Koleksi Pribadi">{page}</AuthenticatedLayout>;

export default KoleksiPribadi;
