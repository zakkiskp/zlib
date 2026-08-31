import { useState, useRef } from 'react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Search, LayoutGrid, List } from 'lucide-react';
import BookGridCard from '@/Components/Katalog/BookGridCard';
import BookTableRow from '@/Components/Katalog/BookTableRow';
import BookDetailModal from '@/Components/Katalog/BookDetailModal';
import Pagination from '@/Components/Katalog/Pagination';
import { useLanguage } from '@/Contexts/LanguageContext';

function KatalogIndex({ buku, kategoriList, filters }) {
    const { t } = useLanguage();
    const [view, setView] = useState('grid');
    const [q, setQ] = useState(filters.q || '');
    const [selected, setSelected] = useState(null);
    const debounceRef = useRef(null);

    // `only: ['buku', 'filters']` — kategoriList gak pernah berubah, jadi gak perlu
    // ikut di-refetch tiap kali search/filter ganti. Ini juga yang bikin switch
    // kategori kerasa lebih cepat (payload lebih kecil, kerjaan server lebih ringan).
    const cari = (value, kategori) => {
        router.get(
            '/katalog',
            { q: value || undefined, kategori: kategori || undefined },
            { preserveState: true, preserveScroll: true, replace: true, only: ['buku', 'filters'] },
        );
    };

    const prefetchKategori = (kategoriId) => {
        router.prefetch(
            '/katalog',
            { method: 'get', data: { q: q || undefined, kategori: kategoriId || undefined } },
            { only: ['buku', 'filters'] },
        );
    };

    const onSearchChange = (e) => {
        const value = e.target.value;
        setQ(value);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => cari(value, filters.kategori), 350);
    };

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-xl font-semibold text-ink">{t('katalog.title')}</h2>
                <p className="text-sm text-muted">{t('katalog.subtitle', { total: buku.total })}</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative max-w-sm flex-1">
                    <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                        value={q}
                        onChange={onSearchChange}
                        type="text"
                        placeholder={t('katalog.search.placeholder')}
                        className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm text-ink placeholder:text-muted focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
                    />
                </div>

                <div className="flex items-center gap-1 rounded-lg border border-border bg-surface p-1">
                    <button
                        onClick={() => setView('grid')}
                        className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
                            view === 'grid' ? 'bg-accent/10 text-accent' : 'text-muted'
                        }`}
                    >
                        <LayoutGrid size={15} />
                    </button>
                    <button
                        onClick={() => setView('table')}
                        className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
                            view === 'table' ? 'bg-accent/10 text-accent' : 'text-muted'
                        }`}
                    >
                        <List size={15} />
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => cari(q, null)}
                    onMouseEnter={() => prefetchKategori(null)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                        !filters.kategori ? 'border-accent/40 bg-accent/10 text-accent' : 'border-border text-muted hover:text-ink'
                    }`}
                >
                    {t('katalog.filter.all')}
                </button>
                {kategoriList.map((k) => (
                    <button
                        key={k.id}
                        onClick={() => cari(q, k.id)}
                        onMouseEnter={() => prefetchKategori(k.id)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                            Number(filters.kategori) === k.id
                                ? 'border-accent/40 bg-accent/10 text-accent'
                                : 'border-border text-muted hover:text-ink'
                        }`}
                    >
                        {k.nama_kategori}
                    </button>
                ))}
            </div>

            {buku.data.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-surface/50 p-12 text-center text-sm text-muted">
                    {t('katalog.empty')}
                </div>
            ) : view === 'grid' ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                    {buku.data.map((b) => (
                        <BookGridCard key={b.id} buku={b} onClick={setSelected} />
                    ))}
                </div>
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-border bg-surface p-4">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wider text-muted">
                                <th className="pb-2 pl-1">{t('katalog.table.book')}</th>
                                <th className="pb-2">{t('katalog.table.category')}</th>
                                <th className="pb-2">{t('katalog.table.rating')}</th>
                                <th className="pb-2 pr-1 text-right">{t('katalog.table.stock')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {buku.data.map((b) => (
                                <BookTableRow key={b.id} buku={b} onClick={setSelected} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Pagination links={buku.links} />

            {selected && <BookDetailModal buku={selected} onClose={() => setSelected(null)} />}
        </div>
    );
}

KatalogIndex.layout = (page) => <AuthenticatedLayout title="Katalog Buku">{page}</AuthenticatedLayout>;

export default KatalogIndex;
