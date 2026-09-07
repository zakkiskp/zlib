import { useState } from 'react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { BookOpen, PackageCheck, AlertTriangle, Banknote } from 'lucide-react';
import { useLanguage } from '@/Contexts/LanguageContext';

function LaporanSirkulasi({ ringkasan, bukuTerpopuler, filters }) {
    const { t } = useLanguage();
    const [dari, setDari] = useState(filters.dari);
    const [sampai, setSampai] = useState(filters.sampai);

    const terapkan = () => {
        router.get('/laporan-sirkulasi', { dari, sampai }, { preserveState: true });
    };

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-xl font-semibold text-ink">{t('laporansirkulasi.title')}</h2>
                <p className="text-sm text-muted">{t('laporansirkulasi.subtitle')}</p>
            </div>

            <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-surface p-4">
                <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-muted">{t('laporansirkulasi.from')}</label>
                    <input
                        type="date"
                        value={dari}
                        onChange={(e) => setDari(e.target.value)}
                        className="mt-1.5 block rounded-lg border border-border bg-base px-3 py-2 text-sm text-ink"
                    />
                </div>
                <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-muted">{t('laporansirkulasi.to')}</label>
                    <input
                        type="date"
                        value={sampai}
                        onChange={(e) => setSampai(e.target.value)}
                        className="mt-1.5 block rounded-lg border border-border bg-base px-3 py-2 text-sm text-ink"
                    />
                </div>
                <button onClick={terapkan} className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white">
                    {t('laporansirkulasi.apply')}
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <div className="rounded-2xl border border-border bg-surface p-5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <BookOpen size={17} />
                    </div>
                    <p className="mt-4 text-2xl font-semibold text-ink">{ringkasan.total_peminjaman}</p>
                    <p className="mt-1 text-sm text-muted">{t('laporansirkulasi.stat.totalLoans')}</p>
                </div>
                <div className="rounded-2xl border border-border bg-surface p-5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <PackageCheck size={17} />
                    </div>
                    <p className="mt-4 text-2xl font-semibold text-ink">{ringkasan.total_pengembalian}</p>
                    <p className="mt-1 text-sm text-muted">{t('laporansirkulasi.stat.totalReturns')}</p>
                </div>
                <div className="rounded-2xl border border-border bg-surface p-5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
                        <AlertTriangle size={17} />
                    </div>
                    <p className="mt-4 text-2xl font-semibold text-ink">{ringkasan.total_terlambat}</p>
                    <p className="mt-1 text-sm text-muted">{t('laporansirkulasi.stat.totalLate')}</p>
                </div>
                <div className="rounded-2xl border border-border bg-surface p-5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                        <Banknote size={17} />
                    </div>
                    <p className="mt-4 text-2xl font-semibold text-ink">
                        Rp{new Intl.NumberFormat('id-ID').format(ringkasan.total_denda)}
                    </p>
                    <p className="mt-1 text-sm text-muted">{t('laporansirkulasi.stat.totalFines')}</p>
                </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-5">
                <p className="text-sm font-semibold text-ink">{t('laporansirkulasi.popularBooks')}</p>
                <div className="mt-3 space-y-2">
                    {bukuTerpopuler.length === 0 ? (
                        <p className="text-sm text-muted">{t('laporansirkulasi.empty')}</p>
                    ) : (
                        bukuTerpopuler.map((b, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                                <span className="text-ink">{b.judul_buku}</span>
                                <span className="text-muted">{t('laporansirkulasi.timesBorrowed', { count: b.total })}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

LaporanSirkulasi.layout = (page) => <AuthenticatedLayout titleKey="laporansirkulasi.title">{page}</AuthenticatedLayout>;

export default LaporanSirkulasi;
