import { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import { X, BookOpen, Send, MapPin, Calendar, Hash, Loader2, Heart } from 'lucide-react';
import StarRating from '@/Components/Katalog/StarRating';
import StarRatingInput from '@/Components/Katalog/StarRatingInput';
import BookCover from '@/Components/BookCover';
import { useLanguage } from '@/Contexts/LanguageContext';

export default function BookDetailModal({ buku, onClose }) {
    const { t } = useLanguage();
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [pesan, setPesan] = useState(null);
    const [favorit, setFavorit] = useState(false);

    const [ratingInput, setRatingInput] = useState(0);
    const [komentarInput, setKomentarInput] = useState('');
    const [submittingUlasan, setSubmittingUlasan] = useState(false);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        fetch(`/katalog/${buku.id}`, { headers: { Accept: 'application/json' } })
            .then((r) => r.json())
            .then((json) => {
                if (!cancelled) {
                    setDetail(json);
                    setFavorit(Boolean(json.buku?.is_favorit));
                    if (json.ulasanSaya) {
                        setRatingInput(json.ulasanSaya.rating);
                        setKomentarInput(json.ulasanSaya.komentar || '');
                    }
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [buku.id]);

    const ajukanPeminjaman = () => {
        setSubmitting(true);
        setPesan(null);
        router.post(
            '/peminjaman',
            { buku_id: buku.id },
            {
                preserveScroll: true,
                onSuccess: () => setPesan({ tipe: 'sukses', teks: t('katalog.detail.requestSuccess') }),
                onError: (errors) => setPesan({ tipe: 'gagal', teks: Object.values(errors)[0] }),
                onFinish: () => setSubmitting(false),
            },
        );
    };

    // Optimistic: hati langsung berubah warna begitu diklik.
    const toggleFavorit = () => {
        setFavorit((v) => !v);
        router.post(`/koleksi-pribadi/${buku.id}/toggle`, {}, { preserveScroll: true, preserveState: true });
    };

    const kirimUlasan = () => {
        setSubmittingUlasan(true);
        router.post(
            `/katalog/${buku.id}/ulasan`,
            { rating: ratingInput, komentar: komentarInput },
            {
                preserveScroll: true,
                onFinish: () => setSubmittingUlasan(false),
            },
        );
    };

    const tersedia = buku.stok_tersedia > 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            <div className="relative flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
                <button
                    onClick={onClose}
                    className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-surface/90 text-muted backdrop-blur-md hover:text-ink"
                >
                    <X size={16} />
                </button>

                <div className="grid flex-1 grid-cols-1 overflow-y-auto md:grid-cols-[280px_1fr]">
                    {/* Kiri: cover besar */}
                    <div className="bg-surface2 p-6">
                        <BookCover src={buku.cover_url} alt={buku.judul_buku} className="aspect-[3/4] rounded-xl shadow-glow-accent" />
                        <span
                            className={`mt-3 inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                                tersedia ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                            }`}
                        >
                            {tersedia ? t('katalog.detail.availableOf', { tersedia: buku.stok_tersedia, total: buku.total_stok }) : t('katalog.detail.outofstock')}
                        </span>
                    </div>

                    {/* Kanan: metadata */}
                    <div className="p-6">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-semibold text-ink">{buku.judul_buku}</h2>
                                <p className="mt-0.5 text-sm text-muted">{buku.penulis}</p>
                            </div>
                            <button
                                onClick={toggleFavorit}
                                title={t('katalog.detail.saveToCollection')}
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border hover:bg-surface2"
                            >
                                <Heart size={16} className={favorit ? 'fill-red-500 text-red-500' : 'text-muted'} />
                            </button>
                        </div>

                        <div className="mt-2 flex items-center gap-3">
                            <StarRating rating={buku.rating_rata_rata} />
                            <span className="text-xs text-muted">{t('katalog.detail.reviews', { count: buku.jumlah_ulasan })}</span>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted">
                            <span className="flex items-center gap-1">
                                <Calendar size={12} /> {buku.tahun_terbit ?? '—'}
                            </span>
                            <span className="flex items-center gap-1">
                                <Hash size={12} /> {buku.isbn ?? '—'}
                            </span>
                            {detail?.buku?.rak && (
                                <span className="flex items-center gap-1">
                                    <MapPin size={12} /> {t('katalog.detail.shelf', { kode: detail.buku.rak.kode_rak })}
                                </span>
                            )}
                        </div>

                        {detail?.buku?.kategoris?.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                                {detail.buku.kategoris.map((k) => (
                                    <span key={k.id} className="rounded-full bg-surface2 px-2.5 py-1 text-[11px] text-muted">
                                        {k.nama_kategori}
                                    </span>
                                ))}
                            </div>
                        )}

                        <p className="mt-4 text-sm leading-relaxed text-muted">
                            {loading ? t('katalog.detail.loadingSynopsis') : detail?.buku?.deskripsi}
                        </p>

                        <div className="mt-5 flex flex-wrap gap-2">
                            {/*
                              FIX BUG ("File PDF belum diunggah" padahal file
                              sudah ada): Link ini sebelumnya pakai prop
                              `prefetch`, yang membuat Inertia meng-cache
                              respons halaman /katalog/{id}/baca selama 30
                              detik (default prefetch.cacheFor). Begitu
                              tombol ini sempat ter-hover SEBELUM admin
                              selesai upload file PDF buku ini, klik
                              berikutnya (walau sudah di-refresh manual)
                              tetap disajikan dari cache lama yang
                              file_pdf_url-nya masih null -> muncul pesan
                              "belum diunggah" walau data di database sudah
                              benar. Halaman baca-online ini bergantung pada
                              data yang bisa berubah kapan saja lewat aksi
                              admin lain, jadi TIDAK boleh di-cache — prop
                              `prefetch` sengaja dihapus supaya setiap klik
                              selalu mengambil data terbaru dari server.
                            */}
                            <Link
                                href={`/katalog/${buku.id}/baca`}
                                className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
                            >
                                <BookOpen size={15} /> {t('katalog.detail.readOnline')}
                            </Link>
                            <button
                                onClick={ajukanPeminjaman}
                                disabled={!tersedia || submitting || detail?.sudahDiajukan}
                                className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-ink transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {submitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                                {detail?.sudahDiajukan ? t('katalog.detail.alreadyRequested') : t('katalog.detail.requestLoan')}
                            </button>
                        </div>

                        {pesan && (
                            <p className={`mt-3 text-sm ${pesan.tipe === 'sukses' ? 'text-emerald-500' : 'text-red-500'}`}>
                                {pesan.teks}
                            </p>
                        )}

                        {detail?.bisaUlasan && (
                            <div className="mt-5 rounded-xl border border-border p-4">
                                <p className="text-sm font-medium text-ink">
                                    {detail?.ulasanSaya ? t('katalog.detail.myReview') : t('katalog.detail.giveReview')}
                                </p>
                                <div className="mt-2">
                                    <StarRatingInput value={ratingInput} onChange={setRatingInput} size={20} />
                                </div>
                                <textarea
                                    value={komentarInput}
                                    onChange={(e) => setKomentarInput(e.target.value)}
                                    rows={3}
                                    placeholder={t('katalog.detail.reviewPlaceholder')}
                                    className="mt-2 w-full resize-none rounded-lg border border-border bg-base px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
                                />
                                <button
                                    onClick={kirimUlasan}
                                    disabled={ratingInput === 0 || submittingUlasan}
                                    className="mt-2 rounded-lg bg-accent px-4 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                                >
                                    {submittingUlasan ? t('katalog.detail.saving') : detail?.ulasanSaya ? t('katalog.detail.updateReview') : t('katalog.detail.sendReview')}
                                </button>
                            </div>
                        )}

                        <div className="mt-6 border-t border-border pt-4">
                            <p className="text-sm font-semibold text-ink">{t('katalog.detail.readerReviews')}</p>
                            <div className="mt-3 space-y-4">
                                {loading && <p className="text-sm text-muted">{t('katalog.detail.loadingReviews')}</p>}
                                {!loading && detail?.ulasan?.length === 0 && (
                                    <p className="text-sm text-muted">{t('katalog.detail.noReviews')}</p>
                                )}
                                {detail?.ulasan?.map((u) => (
                                    <div key={u.id} className="flex gap-3">
                                        {u.avatar ? (
                                            <img src={u.avatar} alt={u.nama} className="h-8 w-8 shrink-0 rounded-full object-cover" />
                                        ) : (
                                            <div className="h-8 w-8 shrink-0 rounded-full bg-surface2" />
                                        )}
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium text-ink">{u.nama}</p>
                                                <StarRating rating={u.rating} showValue={false} size={11} />
                                            </div>
                                            <p className="mt-0.5 text-sm text-muted">{u.komentar}</p>
                                            <p className="mt-0.5 text-[11px] text-muted/70">{u.waktu}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
