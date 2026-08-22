import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BookCover from '@/Components/BookCover';
import Pagination from '@/Components/Katalog/Pagination';
import { CheckCircle2 } from 'lucide-react';

function PengelolaanDenda({ denda, filters, ringkasan }) {
    const filter = (status) => {
        router.get(
            '/pengelolaan-denda',
            { status: status || undefined },
            { preserveState: true, preserveScroll: true, replace: true, only: ['denda', 'filters'] },
        );
    };

    const tandaiLunas = (id) => {
        router.post(`/pengelolaan-denda/${id}/lunas`, {}, { preserveScroll: true });
    };

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-xl font-semibold text-ink">Pengelolaan Denda</h2>
                <p className="text-sm text-muted">Pantau dan tandai pembayaran denda keterlambatan.</p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:max-w-md">
                <div className="rounded-2xl border border-border bg-surface p-4">
                    <p className="text-2xl font-semibold text-ink">
                        Rp{new Intl.NumberFormat('id-ID').format(ringkasan.total_belum_lunas)}
                    </p>
                    <p className="mt-1 text-sm text-muted">Total belum lunas</p>
                </div>
                <div className="rounded-2xl border border-border bg-surface p-4">
                    <p className="text-2xl font-semibold text-ink">{ringkasan.jumlah_belum_lunas}</p>
                    <p className="mt-1 text-sm text-muted">Transaksi belum lunas</p>
                </div>
            </div>

            <div className="flex w-fit gap-1 rounded-lg border border-border bg-surface p-1">
                <button
                    onClick={() => filter(null)}
                    className={`rounded-md px-3.5 py-1.5 text-sm font-medium ${
                        !filters.status ? 'bg-accent/10 text-accent' : 'text-muted hover:text-ink'
                    }`}
                >
                    Semua
                </button>
                <button
                    onClick={() => filter('belum_lunas')}
                    className={`rounded-md px-3.5 py-1.5 text-sm font-medium ${
                        filters.status === 'belum_lunas' ? 'bg-accent/10 text-accent' : 'text-muted hover:text-ink'
                    }`}
                >
                    Belum Lunas
                </button>
                <button
                    onClick={() => filter('lunas')}
                    className={`rounded-md px-3.5 py-1.5 text-sm font-medium ${
                        filters.status === 'lunas' ? 'bg-accent/10 text-accent' : 'text-muted hover:text-ink'
                    }`}
                >
                    Lunas
                </button>
            </div>

            {denda.data.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-surface/50 p-12 text-center text-sm text-muted">
                    Tidak ada data denda.
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-border bg-surface">
                    {denda.data.map((d) => (
                        <div key={d.id} className="flex items-center gap-3 border-b border-border/60 p-4 last:border-0">
                            <BookCover src={d.buku?.cover_url} alt={d.buku?.judul_buku} className="h-14 w-10 shrink-0 rounded-md" />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-ink">{d.buku?.judul_buku}</p>
                                <p className="truncate text-xs text-muted">{d.anggota?.name}</p>
                            </div>
                            <p className="shrink-0 text-sm font-semibold text-red-500">
                                Rp{new Intl.NumberFormat('id-ID').format(d.denda)}
                            </p>
                            {d.status_denda === 'belum_lunas' ? (
                                <button
                                    onClick={() => tandaiLunas(d.id)}
                                    className="flex shrink-0 items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white"
                                >
                                    <CheckCircle2 size={13} /> Tandai Lunas
                                </button>
                            ) : (
                                <span className="shrink-0 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-500">
                                    Lunas
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}
            <Pagination links={denda.links} />
        </div>
    );
}

PengelolaanDenda.layout = (page) => <AuthenticatedLayout title="Pengelolaan Denda">{page}</AuthenticatedLayout>;

export default PengelolaanDenda;
