import { useState, useRef } from 'react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BookCover from '@/Components/BookCover';
import Pagination from '@/Components/Katalog/Pagination';
import { Search, Save } from 'lucide-react';
import { useLanguage } from '@/Contexts/LanguageContext';

function DataBuku({ buku, filters }) {
    const { t } = useLanguage();
    const [q, setQ] = useState(filters.q || '');
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({ stok_tersedia: 0, total_stok: 0 });
    const [saving, setSaving] = useState(false);
    const debounceRef = useRef(null);

    const cari = (value) => {
        router.get(
            '/data-buku',
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

    const mulaiEdit = (b) => {
        setEditId(b.id);
        setForm({ stok_tersedia: b.stok_tersedia, total_stok: b.total_stok });
    };

    const simpan = (id) => {
        setSaving(true);
        router.patch(`/data-buku/${id}/stok`, form, {
            preserveScroll: true,
            onSuccess: () => setEditId(null),
            onFinish: () => setSaving(false),
        });
    };

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-xl font-semibold text-ink">{t('databuku.title')}</h2>
                <p className="text-sm text-muted">{t('databuku.subtitle')}</p>
            </div>

            <div className="relative max-w-sm">
                <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                    value={q}
                    onChange={onSearch}
                    placeholder={t('databuku.search.placeholder')}
                    className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm text-ink placeholder:text-muted focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
            </div>

            <div className="overflow-hidden rounded-2xl border border-border bg-surface">
                {buku.data.map((b) => (
                    <div key={b.id} className="flex items-center gap-3 border-b border-border/60 p-4 last:border-0">
                        <BookCover src={b.cover_url} alt={b.judul_buku} className="h-16 w-12 shrink-0 rounded-lg" />
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-ink">{b.judul_buku}</p>
                            <p className="truncate text-xs text-muted">{b.penulis}</p>
                        </div>

                        {editId === b.id ? (
                            <div className="flex shrink-0 items-center gap-2">
                                <input
                                    type="number"
                                    min={0}
                                    value={form.stok_tersedia}
                                    onChange={(e) => setForm((f) => ({ ...f, stok_tersedia: Number(e.target.value) }))}
                                    className="w-16 rounded-lg border border-border bg-base px-2 py-1 text-center text-sm text-ink"
                                />
                                <span className="text-xs text-muted">/</span>
                                <input
                                    type="number"
                                    min={0}
                                    value={form.total_stok}
                                    onChange={(e) => setForm((f) => ({ ...f, total_stok: Number(e.target.value) }))}
                                    className="w-16 rounded-lg border border-border bg-base px-2 py-1 text-center text-sm text-ink"
                                />
                                <button
                                    onClick={() => simpan(b.id)}
                                    disabled={saving}
                                    className="flex items-center gap-1 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                                >
                                    <Save size={12} /> {t('databuku.save')}
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => mulaiEdit(b)}
                                className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-ink hover:bg-surface2"
                            >
                                {t('databuku.availableOf', { tersedia: b.stok_tersedia, total: b.total_stok })}
                            </button>
                        )}
                    </div>
                ))}
            </div>
            <Pagination links={buku.links} />
        </div>
    );
}

DataBuku.layout = (page) => <AuthenticatedLayout title="Data Buku">{page}</AuthenticatedLayout>;

export default DataBuku;
