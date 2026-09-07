import { useState, useRef } from 'react';
import { Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BookCover from '@/Components/BookCover';
import Pagination from '@/Components/Katalog/Pagination';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { useConfirm } from '@/Hooks/useConfirm';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { useLanguage } from '@/Contexts/LanguageContext';

function AdminBukuIndex({ buku, filters }) {
    const { t } = useLanguage();
    const [q, setQ] = useState(filters.q || '');
    const debounceRef = useRef(null);
    const { confirmState, confirm, handleConfirm, handleCancel } = useConfirm();

    const cari = (value) => {
        router.get(
            '/admin/buku',
            { q: value || undefined },
            { preserveState: true, preserveScroll: true, replace: true, only: ['buku', 'filters'] },
        );
    };

    const onSearch = (e) => {
        const value = e.target.value;
        setQ(value);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => cari(value), 350);
    };

    const hapus = async (id, judul) => {
        const ok = await confirm(t('adminbuku.confirmDelete.title'), t('adminbuku.confirmDelete.message', { judul }));
        if (ok) {
            router.delete(`/admin/buku/${id}`, { preserveScroll: true });
        }
    };

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-semibold text-ink">{t('adminbuku.title')}</h2>
                    <p className="text-sm text-muted">{t('adminbuku.subtitle', { total: buku.total })}</p>
                </div>
                <Link
                    href="/admin/buku/create"
                    prefetch
                    className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
                >
                    <Plus size={15} /> {t('adminbuku.add')}
                </Link>
            </div>

            <div className="relative max-w-sm">
                <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                    value={q}
                    onChange={onSearch}
                    placeholder={t('adminbuku.search.placeholder')}
                    className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm text-ink placeholder:text-muted focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
            </div>

            <div className="overflow-hidden rounded-2xl border border-border bg-surface">
                {buku.data.map((b) => (
                    <div key={b.id} className="flex items-center gap-3 border-b border-border/60 p-4 last:border-0">
                        <BookCover src={b.cover_url} alt={b.judul_buku} className="h-16 w-12 shrink-0 rounded-lg" />
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-ink">{b.judul_buku}</p>
                            <p className="truncate text-xs text-muted">
                                {b.penulis} · {b.kategoris?.map((k) => k.nama_kategori).join(', ') || t('adminbuku.noCategory')}
                            </p>
                        </div>
                        <span className="shrink-0 text-xs text-muted">
                            {t('adminbuku.stock', { tersedia: b.stok_tersedia, total: b.total_stok })}
                        </span>
                        <Link
                            href={`/admin/buku/${b.id}/edit`}
                            prefetch
                            className="shrink-0 rounded-lg border border-border p-2 text-muted hover:bg-surface2 hover:text-ink"
                        >
                            <Pencil size={14} />
                        </Link>
                        <button
                            onClick={() => hapus(b.id, b.judul_buku)}
                            className="shrink-0 rounded-lg border border-border p-2 text-muted hover:bg-red-500/10 hover:text-red-500"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>
            <Pagination links={buku.links} />

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

AdminBukuIndex.layout = (page) => <AuthenticatedLayout titleKey="adminbuku.title">{page}</AuthenticatedLayout>;

export default AdminBukuIndex;
