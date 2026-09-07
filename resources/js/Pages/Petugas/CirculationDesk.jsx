import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BookCover from '@/Components/BookCover';
import Pagination from '@/Components/Katalog/Pagination';
import { Check, X, PackageCheck, Clock } from 'lucide-react';
import { useLanguage } from '@/Contexts/LanguageContext';

function CirculationDesk({ menunggu: menungguAwal, perpanjangan, sedangDipinjam }) {
    const { t } = useLanguage();
    const [tab, setTab] = useState('menunggu');
    const [loadingId, setLoadingId] = useState(null);
    const [menunggu, setMenunggu] = useState(menungguAwal);

    // Sinkron ulang tiap kali props server berubah (habis approve/reject/dst, halaman reload)
    useEffect(() => {
        setMenunggu(menungguAwal);
    }, [menungguAwal]);

    // Live update lewat Reverb — pengajuan baru dari anggota langsung nongol
    // di sini tanpa petugas perlu refresh halaman.
    useEffect(() => {
        if (!window.Echo) return;

        const channel = window.Echo.private('circulation-desk');
        channel.listen('.peminjaman.diajukan', (payload) => {
            setMenunggu((prev) => [payload, ...prev]);
        });

        return () => {
            window.Echo.leave('circulation-desk');
        };
    }, []);

    const aksi = (url, id) => {
        setLoadingId(id);
        router.post(url, {}, { preserveScroll: true, onFinish: () => setLoadingId(null) });
    };

    return (
        <div className="space-y-5">
            <div className="flex items-center gap-2">
                <div>
                    <h2 className="text-xl font-semibold text-ink">{t('circulation.title')}</h2>
                    <p className="text-sm text-muted">{t('circulation.subtitle')}</p>
                </div>
                <span className="ml-auto flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10.5px] font-medium text-emerald-500">
                    <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-emerald-500" /> {t('circulation.live')}
                </span>
            </div>

            <div className="flex w-fit flex-wrap gap-1 rounded-lg border border-border bg-surface p-1">
                <button
                    onClick={() => setTab('menunggu')}
                    className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
                        tab === 'menunggu' ? 'bg-accent/10 text-accent' : 'text-muted hover:text-ink'
                    }`}
                >
                    {t('circulation.tab.waiting', { count: menunggu.length })}
                </button>
                <button
                    onClick={() => setTab('perpanjangan')}
                    className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
                        tab === 'perpanjangan' ? 'bg-accent/10 text-accent' : 'text-muted hover:text-ink'
                    }`}
                >
                    {t('circulation.tab.extension', { count: perpanjangan.length })}
                </button>
                <button
                    onClick={() => setTab('dipinjam')}
                    className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
                        tab === 'dipinjam' ? 'bg-accent/10 text-accent' : 'text-muted hover:text-ink'
                    }`}
                >
                    {t('circulation.tab.borrowed')}
                </button>
            </div>

            {tab === 'menunggu' && (
                <div className="space-y-3">
                    {menunggu.length === 0 ? (
                        <EmptyState text={t('circulation.empty.waiting')} />
                    ) : (
                        menunggu.map((p) => (
                            <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4">
                                <BookCover
                                    src={p.buku?.cover_url}
                                    alt={p.buku?.judul_buku}
                                    className="h-16 w-12 shrink-0 rounded-lg"
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-ink">{p.buku?.judul_buku}</p>
                                    <p className="truncate text-xs text-muted">
                                        {p.nama ?? p.anggota?.name} · {p.waktu ?? t('circulation.stock', { count: p.buku?.stok_tersedia })}
                                    </p>
                                </div>
                                <button
                                    onClick={() => aksi(`/peminjaman/${p.id}/approve`, p.id)}
                                    disabled={loadingId === p.id || p.buku?.stok_tersedia < 1}
                                    className="flex shrink-0 items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                                >
                                    <Check size={13} /> {t('circulation.approve')}
                                </button>
                                <button
                                    onClick={() => aksi(`/peminjaman/${p.id}/reject`, p.id)}
                                    disabled={loadingId === p.id}
                                    className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-red-500 disabled:opacity-50"
                                >
                                    <X size={13} /> {t('circulation.reject')}
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}

            {tab === 'perpanjangan' && (
                <div className="space-y-3">
                    {perpanjangan.length === 0 ? (
                        <EmptyState text={t('circulation.empty.extension')} />
                    ) : (
                        perpanjangan.map((p) => (
                            <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4">
                                <BookCover
                                    src={p.buku?.cover_url}
                                    alt={p.buku?.judul_buku}
                                    className="h-16 w-12 shrink-0 rounded-lg"
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-ink">{p.buku?.judul_buku}</p>
                                    <p className="truncate text-xs text-muted">{p.anggota?.name}</p>
                                </div>
                                <button
                                    onClick={() => aksi(`/peminjaman/${p.id}/perpanjangan/approve`, p.id)}
                                    disabled={loadingId === p.id}
                                    className="flex shrink-0 items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                                >
                                    <Check size={13} /> {t('circulation.approve')}
                                </button>
                                <button
                                    onClick={() => aksi(`/peminjaman/${p.id}/perpanjangan/reject`, p.id)}
                                    disabled={loadingId === p.id}
                                    className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-red-500 disabled:opacity-50"
                                >
                                    <X size={13} /> {t('circulation.reject')}
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}

            {tab === 'dipinjam' && (
                <div className="space-y-3">
                    {sedangDipinjam.data.length === 0 ? (
                        <EmptyState text={t('circulation.empty.borrowed')} />
                    ) : (
                        sedangDipinjam.data.map((p) => (
                            <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4">
                                <BookCover
                                    src={p.buku?.cover_url}
                                    alt={p.buku?.judul_buku}
                                    className="h-16 w-12 shrink-0 rounded-lg"
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-ink">{p.buku?.judul_buku}</p>
                                    <p className="truncate text-xs text-muted">
                                        {p.anggota?.name} ·{' '}
                                        {p.tanggal_jatuh_tempo
                                            ? t('circulation.dueDate', { date: new Date(p.tanggal_jatuh_tempo).toLocaleDateString('id-ID') })
                                            : '—'}
                                    </p>
                                </div>
                                {p.status === 'terlambat' && (
                                    <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-red-500">
                                        <Clock size={12} /> {t('circulation.late')}
                                    </span>
                                )}
                                <button
                                    onClick={() => aksi(`/peminjaman/${p.id}/kembalikan`, p.id)}
                                    disabled={loadingId === p.id}
                                    className="flex shrink-0 items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                                >
                                    <PackageCheck size={13} /> {t('circulation.return')}
                                </button>
                            </div>
                        ))
                    )}
                    <Pagination links={sedangDipinjam.links} />
                </div>
            )}
        </div>
    );
}

function EmptyState({ text }) {
    return (
        <div className="rounded-2xl border border-dashed border-border bg-surface/50 p-12 text-center text-sm text-muted">
            {text}
        </div>
    );
}

CirculationDesk.layout = (page) => <AuthenticatedLayout titleKey="circulation.title">{page}</AuthenticatedLayout>;

export default CirculationDesk;
