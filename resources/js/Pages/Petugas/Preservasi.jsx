import { useState, useRef } from 'react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BookCover from '@/Components/BookCover';
import Pagination from '@/Components/Katalog/Pagination';
import { Search, ShieldAlert, Send } from 'lucide-react';
import SearchableSelect from '@/Components/SearchableSelect';
import { useLanguage } from '@/Contexts/LanguageContext';

function Preservasi({ buku, filters, usulan }) {
    const { t } = useLanguage();
    const [q, setQ] = useState(filters.q || '');

    const kondisiOptions = [
        { value: 'baik', label: t('preservasi.kondisi.baik') },
        { value: 'rusak', label: t('preservasi.kondisi.rusak') },
        { value: 'hilang', label: t('preservasi.kondisi.hilang') },
    ];
    const [judul, setJudul] = useState('');
    const [alasan, setAlasan] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const debounceRef = useRef(null);

    const cari = (value) => {
        router.get(
            '/preservasi-buku',
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

    const ubahKondisi = (id, kondisi) => {
        router.patch(`/preservasi-buku/${id}/kondisi`, { kondisi }, { preserveScroll: true, preserveState: true });
    };

    const kirimUsulan = () => {
        if (!judul.trim()) return;
        setSubmitting(true);
        router.post(
            '/preservasi-buku/usulan',
            { judul, alasan },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setJudul('');
                    setAlasan('');
                },
                onFinish: () => setSubmitting(false),
            },
        );
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-ink">{t('preservasi.title')}</h2>
                <p className="text-sm text-muted">{t('preservasi.subtitle')}</p>
            </div>

            <div>
                <div className="mb-3 relative max-w-sm">
                    <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                        value={q}
                        onChange={onSearch}
                        placeholder={t('preservasi.search.placeholder')}
                        className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm text-ink placeholder:text-muted focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
                    />
                </div>

                <div className="overflow-hidden rounded-2xl border border-border bg-surface">
                    {buku.data.map((b) => (
                        <div key={b.id} className="flex items-center gap-3 border-b border-border/60 p-3 last:border-0">
                            <BookCover src={b.cover_url} alt={b.judul_buku} className="h-14 w-10 shrink-0 rounded-md" />
                            <p className="flex-1 truncate text-sm font-medium text-ink">{b.judul_buku}</p>
                            <div className="w-32 shrink-0">
                                <SearchableSelect
                                    value={b.kondisi}
                                    onChange={(val) => ubahKondisi(b.id, val)}
                                    options={kondisiOptions}
                                    searchPlaceholder={t('common.search')}
                                    emptyText={t('common.noResults')}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-3">
                    <Pagination links={buku.links} />
                </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-5">
                <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                    <ShieldAlert size={15} /> {t('preservasi.proposeNew')}
                </p>
                <div className="mt-3 space-y-3">
                    <input
                        value={judul}
                        onChange={(e) => setJudul(e.target.value)}
                        placeholder={t('preservasi.field.title')}
                        className="w-full rounded-lg border border-border bg-base px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
                    />
                    <textarea
                        value={alasan}
                        onChange={(e) => setAlasan(e.target.value)}
                        rows={2}
                        placeholder={t('preservasi.field.reason')}
                        className="w-full resize-none rounded-lg border border-border bg-base px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
                    />
                    <button
                        onClick={kirimUsulan}
                        disabled={submitting || !judul.trim()}
                        className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                    >
                        <Send size={14} /> {t('preservasi.send')}
                    </button>
                </div>

                {usulan.length > 0 && (
                    <div className="mt-5 space-y-3 border-t border-border pt-4">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted">{t('preservasi.sentProposals')}</p>
                        {usulan.map((u) => (
                            <div key={u.id} className="text-sm">
                                <p className="font-medium text-ink">{u.judul}</p>
                                <p className="text-xs text-muted">
                                    {t('preservasi.proposalMeta', { alasan: u.alasan, nama: u.nama, waktu: u.waktu })}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

Preservasi.layout = (page) => <AuthenticatedLayout title="Preservasi Buku">{page}</AuthenticatedLayout>;

export default Preservasi;
