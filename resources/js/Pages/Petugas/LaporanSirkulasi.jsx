import { useState } from 'react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { BookOpen, PackageCheck, AlertTriangle, Banknote } from 'lucide-react';

function LaporanSirkulasi({ ringkasan, bukuTerpopuler, filters }) {
    const [dari, setDari] = useState(filters.dari);
    const [sampai, setSampai] = useState(filters.sampai);

    const terapkan = () => {
        router.get('/laporan-sirkulasi', { dari, sampai }, { preserveState: true });
    };

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-xl font-semibold text-ink">Laporan Sirkulasi</h2>
                <p className="text-sm text-muted">Ringkasan aktivitas peminjaman dalam rentang tanggal tertentu.</p>
            </div>

            <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-surface p-4">
                <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-muted">Dari</label>
                    <input
                        type="date"
                        value={dari}
                        onChange={(e) => setDari(e.target.value)}
                        className="mt-1.5 block rounded-lg border border-border bg-base px-3 py-2 text-sm text-ink"
                    />
                </div>
                <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-muted">Sampai</label>
                    <input
                        type="date"
                        value={sampai}
                        onChange={(e) => setSampai(e.target.value)}
                        className="mt-1.5 block rounded-lg border border-border bg-base px-3 py-2 text-sm text-ink"
                    />
                </div>
                <button onClick={terapkan} className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white">
                    Terapkan
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <div className="rounded-2xl border border-border bg-surface p-5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <BookOpen size={17} />
                    </div>
                    <p className="mt-4 text-2xl font-semibold text-ink">{ringkasan.total_peminjaman}</p>
                    <p className="mt-1 text-sm text-muted">Total Peminjaman</p>
                </div>
                <div className="rounded-2xl border border-border bg-surface p-5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <PackageCheck size={17} />
                    </div>
                    <p className="mt-4 text-2xl font-semibold text-ink">{ringkasan.total_pengembalian}</p>
                    <p className="mt-1 text-sm text-muted">Total Pengembalian</p>
                </div>
                <div className="rounded-2xl border border-border bg-surface p-5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
                        <AlertTriangle size={17} />
                    </div>
                    <p className="mt-4 text-2xl font-semibold text-ink">{ringkasan.total_terlambat}</p>
                    <p className="mt-1 text-sm text-muted">Pengembalian Terlambat</p>
                </div>
                <div className="rounded-2xl border border-border bg-surface p-5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                        <Banknote size={17} />
                    </div>
                    <p className="mt-4 text-2xl font-semibold text-ink">
                        Rp{new Intl.NumberFormat('id-ID').format(ringkasan.total_denda)}
                    </p>
                    <p className="mt-1 text-sm text-muted">Total Denda</p>
                </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-5">
                <p className="text-sm font-semibold text-ink">Buku Terpopuler</p>
                <div className="mt-3 space-y-2">
                    {bukuTerpopuler.length === 0 ? (
                        <p className="text-sm text-muted">Belum ada data pada rentang ini.</p>
                    ) : (
                        bukuTerpopuler.map((b, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                                <span className="text-ink">{b.judul_buku}</span>
                                <span className="text-muted">{b.total}x dipinjam</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

LaporanSirkulasi.layout = (page) => <AuthenticatedLayout title="Laporan Sirkulasi">{page}</AuthenticatedLayout>;

export default LaporanSirkulasi;
