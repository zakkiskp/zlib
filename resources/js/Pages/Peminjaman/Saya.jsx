import { useState } from 'react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BookCover from '@/Components/BookCover';
import Pagination from '@/Components/Katalog/Pagination';
import { Clock, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/Contexts/LanguageContext';

const STATUS_COLOR = {
    menunggu_persetujuan: 'bg-amber-500/10 text-amber-500',
    disetujui: 'bg-accent/10 text-accent',
    dipinjam: 'bg-accent/10 text-accent',
    terlambat: 'bg-red-500/10 text-red-500',
    dikembalikan: 'bg-emerald-500/10 text-emerald-500',
    ditolak: 'bg-red-500/10 text-red-500',
};

function sisaHari(tanggal) {
    if (!tanggal) return null;
    const target = new Date(tanggal);
    target.setHours(23, 59, 59, 999);
    return Math.ceil((target.getTime() - Date.now()) / 86400000);
}

function Saya({ aktif, riwayat, pengaturan }) {
    const { t } = useLanguage();
    const [tab, setTab] = useState('aktif');
    const [loadingId, setLoadingId] = useState(null);

    const ajukanPerpanjangan = (id) => {
        setLoadingId(id);
        router.post(
            `/peminjaman/${id}/perpanjang`,
            {},
            { preserveScroll: true, onFinish: () => setLoadingId(null) },
        );
    };

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-xl font-semibold text-ink">{t('peminjaman.title')}</h2>
                <p className="text-sm text-muted">{t('peminjaman.subtitle')}</p>
            </div>

            <div className="flex w-fit gap-1 rounded-lg border border-border bg-surface p-1">
                <button
                    onClick={() => setTab('aktif')}
                    className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
                        tab === 'aktif' ? 'bg-accent/10 text-accent' : 'text-muted hover:text-ink'
                    }`}
                >
                    {t('peminjaman.tab.active', { count: aktif.length })}
                </button>
                <button
                    onClick={() => setTab('riwayat')}
                    className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
                        tab === 'riwayat' ? 'bg-accent/10 text-accent' : 'text-muted hover:text-ink'
                    }`}
                >
                    {t('peminjaman.tab.history')}
                </button>
            </div>

            {tab === 'aktif' ? (
                aktif.length === 0 ? (
                    <EmptyState text={t('peminjaman.empty.active')} />
                ) : (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {aktif.map((p) => {
                            const sisa = sisaHari(p.tanggal_jatuh_tempo);
                            const statusColor = STATUS_COLOR[p.status] ?? STATUS_COLOR.dipinjam;
                            const bisaPerpanjang =
                                p.status === 'dipinjam' &&
                                p.status_perpanjangan !== 'menunggu' &&
                                p.jumlah_perpanjangan < pengaturan.max_perpanjangan;

                            return (
                                <div key={p.id} className="flex gap-3 rounded-2xl border border-border bg-surface p-4">
                                    <BookCover
                                        src={p.buku?.cover_url}
                                        alt={p.buku?.judul_buku}
                                        className="h-24 w-16 shrink-0 rounded-lg"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-ink">{p.buku?.judul_buku}</p>
                                        <p className="truncate text-xs text-muted">{p.buku?.penulis}</p>
                                        <span
                                            className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10.5px] font-medium ${statusColor}`}
                                        >
                                            {t(`peminjaman.status.${p.status}`)}
                                        </span>

                                        {p.tanggal_jatuh_tempo && (
                                            <p
                                                className={`mt-2 flex items-center gap-1 text-xs font-medium ${
                                                    sisa < 0 ? 'text-red-500' : sisa <= 2 ? 'text-amber-500' : 'text-muted'
                                                }`}
                                            >
                                                <Clock size={12} />
                                                {sisa < 0
                                                    ? t('peminjaman.due.late', { days: Math.abs(sisa) })
                                                    : sisa === 0
                                                    ? t('peminjaman.due.today')
                                                    : t('peminjaman.due.remaining', { days: sisa })}
                                            </p>
                                        )}

                                        {p.status === 'dipinjam' && (
                                            <button
                                                onClick={() => ajukanPerpanjangan(p.id)}
                                                disabled={!bisaPerpanjang || loadingId === p.id}
                                                className="mt-2 flex items-center gap-1.5 text-xs font-medium text-accent hover:underline disabled:cursor-not-allowed disabled:text-muted disabled:no-underline"
                                            >
                                                <RefreshCw size={12} />
                                                {p.status_perpanjangan === 'menunggu'
                                                    ? t('peminjaman.extend.waiting')
                                                    : p.jumlah_perpanjangan >= pengaturan.max_perpanjangan
                                                    ? t('peminjaman.extend.limitReached')
                                                    : t('peminjaman.extend.request')}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )
            ) : (
                <div className="space-y-3">
                    {riwayat.data.length === 0 ? (
                        <EmptyState text={t('peminjaman.empty.history')} />
                    ) : (
                        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
                            {riwayat.data.map((p) => {
                                const statusColor = STATUS_COLOR[p.status] ?? STATUS_COLOR.dikembalikan;
                                return (
                                    <div key={p.id} className="flex items-center gap-3 border-b border-border/60 p-4 last:border-0">
                                        <BookCover
                                            src={p.buku?.cover_url}
                                            alt={p.buku?.judul_buku}
                                            className="h-14 w-10 shrink-0 rounded-md"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-ink">{p.buku?.judul_buku}</p>
                                            <p className="text-xs text-muted">
                                                {p.tanggal_pinjam ? new Date(p.tanggal_pinjam).toLocaleDateString('id-ID') : '—'}
                                                {' — '}
                                                {p.tanggal_kembali ? new Date(p.tanggal_kembali).toLocaleDateString('id-ID') : t('peminjaman.history.notReturned')}
                                            </p>
                                        </div>
                                        <div className="shrink-0 text-right">
                                            <span className={`inline-block rounded-full px-2 py-0.5 text-[10.5px] font-medium ${statusColor}`}>
                                                {t(`peminjaman.status.${p.status}`)}
                                            </span>
                                            {p.denda > 0 && (
                                                <p className="mt-1 text-xs font-medium text-red-500">
                                                    Rp{new Intl.NumberFormat('id-ID').format(p.denda)}
                                                    <span className="ml-1 text-muted">({p.status_denda})</span>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    <Pagination links={riwayat.links} />
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

Saya.layout = (page) => <AuthenticatedLayout titleKey="peminjaman.title">{page}</AuthenticatedLayout>;

export default Saya;
