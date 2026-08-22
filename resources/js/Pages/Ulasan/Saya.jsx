import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BookCover from '@/Components/BookCover';
import StarRating from '@/Components/Katalog/StarRating';
import Pagination from '@/Components/Katalog/Pagination';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { useConfirm } from '@/Hooks/useConfirm';
import { Trash2 } from 'lucide-react';

function UlasanSaya({ ulasan }) {
    const { confirmState, confirm, handleConfirm, handleCancel } = useConfirm();

    const hapus = async (id) => {
        const ok = await confirm('Hapus Ulasan?', 'Ulasan yang sudah dihapus tidak bisa dikembalikan.');
        if (ok) {
            router.delete(`/ulasan/${id}`, { preserveScroll: true });
        }
    };

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-xl font-semibold text-ink">Ulasan Saya</h2>
                <p className="text-sm text-muted">Kelola review dan rating yang pernah kamu berikan.</p>
            </div>

            {ulasan.data.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-surface/50 p-12 text-center text-sm text-muted">
                    Belum ada ulasan. Pinjam buku dan beri ulasan lewat halaman Katalog.
                </div>
            ) : (
                <div className="space-y-3">
                    {ulasan.data.map((u) => (
                        <div key={u.id} className="flex gap-3 rounded-2xl border border-border bg-surface p-4">
                            <BookCover src={u.buku?.cover_url} alt={u.buku?.judul_buku} className="h-20 w-14 shrink-0 rounded-lg" />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-ink">{u.buku?.judul_buku}</p>
                                <div className="mt-1">
                                    <StarRating rating={u.rating} size={13} />
                                </div>
                                <p className="mt-1.5 text-sm text-muted">
                                    {u.komentar || <span className="italic">Tanpa komentar</span>}
                                </p>
                            </div>
                            <button onClick={() => hapus(u.id)} className="shrink-0 text-muted hover:text-red-500">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <Pagination links={ulasan.links} />

            <ConfirmDialog
                open={confirmState.open}
                title={confirmState.title}
                message={confirmState.message}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </div>
    );
}

UlasanSaya.layout = (page) => <AuthenticatedLayout title="Ulasan Saya">{page}</AuthenticatedLayout>;

export default UlasanSaya;
