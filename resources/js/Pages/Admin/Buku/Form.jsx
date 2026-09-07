import { useState } from 'react';
import { useForm, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BookCover from '@/Components/BookCover';
import { Save, Upload, FileText, ArrowLeft, CheckCircle2 } from 'lucide-react';
import SearchableSelect from '@/Components/SearchableSelect';
import { useLanguage } from '@/Contexts/LanguageContext';

function BukuForm({ buku, kategoriList, rakList }) {
    const { t } = useLanguage();
    const isEdit = Boolean(buku);

    const rakOptions = [
        { value: '', label: t('adminbuku.field.shelf.notset') },
        ...rakList.map((r) => ({ value: r.id, label: `${r.kode_rak} — ${r.lokasi}` })),
    ];
    const kondisiOptions = [
        { value: 'baik', label: t('preservasi.kondisi.baik') },
        { value: 'rusak', label: t('preservasi.kondisi.rusak') },
        { value: 'hilang', label: t('preservasi.kondisi.hilang') },
    ];

    const form = useForm({
        judul_buku: buku?.judul_buku || '',
        penulis: buku?.penulis || '',
        penerbit: buku?.penerbit || '',
        tahun_terbit: buku?.tahun_terbit || '',
        isbn: buku?.isbn || '',
        deskripsi: buku?.deskripsi || '',
        bahasa: buku?.bahasa || 'Indonesia',
        jumlah_halaman: buku?.jumlah_halaman || '',
        total_stok: buku?.total_stok ?? 1,
        stok_tersedia: buku?.stok_tersedia ?? 1,
        kondisi: buku?.kondisi || 'baik',
        rak_id: buku?.rak_id || '',
        kategori_ids: buku?.kategoris?.map((k) => k.id) || [],
    });

    const [uploadingCover, setUploadingCover] = useState(false);
    const [uploadingPdf, setUploadingPdf] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    const toggleKategori = (id) => {
        const current = form.data.kategori_ids;
        form.setData('kategori_ids', current.includes(id) ? current.filter((k) => k !== id) : [...current, id]);
    };

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            form.put(`/admin/buku/${buku.id}`);
        } else {
            form.post('/admin/buku');
        }
    };

    const uploadCover = (file) => {
        if (!file || !file.type.startsWith('image/')) return;
        setUploadingCover(true);
        router.post(
            `/admin/buku/${buku.id}/cover`,
            { cover: file },
            { forceFormData: true, preserveScroll: true, onFinish: () => setUploadingCover(false) },
        );
    };

    const uploadPdf = (file) => {
        if (!file || file.type !== 'application/pdf') return;
        setUploadingPdf(true);
        router.post(
            `/admin/buku/${buku.id}/pdf`,
            { pdf: file },
            { forceFormData: true, preserveScroll: true, onFinish: () => setUploadingPdf(false) },
        );
    };

    return (
        <div className="space-y-5">
            <Link href="/admin/buku" prefetch className="flex w-fit items-center gap-1.5 text-sm text-muted hover:text-ink">
                <ArrowLeft size={15} /> {t('adminbuku.form.backToList')}
            </Link>

            <h2 className="text-xl font-semibold text-ink">{isEdit ? t('adminbuku.form.editTitle') : t('adminbuku.form.createTitle')}</h2>

            <div className={`grid grid-cols-1 gap-5 ${isEdit ? 'lg:grid-cols-[280px_1fr]' : ''}`}>
                {isEdit && (
                    <div className="space-y-4">
                        <div className="rounded-2xl border border-border bg-surface p-4">
                            <BookCover src={buku.cover_url} alt={buku.judul_buku} className="aspect-[3/4] rounded-xl" />
                            <label
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setDragOver(true);
                                }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    setDragOver(false);
                                    uploadCover(e.dataTransfer.files[0]);
                                }}
                                className={`mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed py-2.5 text-xs font-medium transition-colors ${
                                    dragOver ? 'border-accent bg-accent/5 text-accent' : 'border-border text-muted hover:border-accent/40 hover:text-accent'
                                }`}
                            >
                                <Upload size={13} /> {uploadingCover ? t('adminbuku.form.uploading') : t('adminbuku.form.changeCover')}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => uploadCover(e.target.files[0])}
                                />
                            </label>
                        </div>

                        <div className="rounded-2xl border border-border bg-surface p-4">
                            <p className="flex items-center gap-2 text-xs font-medium text-muted">
                                <FileText size={13} /> {t('adminbuku.form.pdfFile')}
                            </p>
                            <p className="mt-1.5 flex items-center gap-1.5 text-xs">
                                {buku.file_pdf_url ? (
                                    <span className="flex items-center gap-1 text-emerald-500">
                                        <CheckCircle2 size={12} /> {t('adminbuku.form.fileUploaded')}
                                    </span>
                                ) : (
                                    <span className="text-muted">{t('adminbuku.form.noFile')}</span>
                                )}
                            </p>
                            <label className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border py-2.5 text-xs font-medium text-muted hover:border-accent/40 hover:text-accent">
                                <Upload size={13} /> {uploadingPdf ? t('adminbuku.form.uploading') : t('adminbuku.form.uploadPdf')}
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    className="hidden"
                                    onChange={(e) => uploadPdf(e.target.files[0])}
                                />
                            </label>
                        </div>
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border bg-surface p-5">
                    {!isEdit && (
                        <p className="rounded-lg bg-accent/10 px-3 py-2 text-xs text-accent">
                            {t('adminbuku.form.createHint')}
                        </p>
                    )}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="text-xs font-medium uppercase tracking-wider text-muted">{t('adminbuku.field.title')}</label>
                            <input
                                value={form.data.judul_buku}
                                onChange={(e) => form.setData('judul_buku', e.target.value)}
                                className="mt-1.5 w-full rounded-lg border border-border bg-base px-3 py-2 text-sm text-ink focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
                            />
                            {form.errors.judul_buku && <p className="mt-1 text-xs text-red-500">{form.errors.judul_buku}</p>}
                        </div>
                        <div>
                            <label className="text-xs font-medium uppercase tracking-wider text-muted">{t('adminbuku.field.author')}</label>
                            <input
                                value={form.data.penulis}
                                onChange={(e) => form.setData('penulis', e.target.value)}
                                className="mt-1.5 w-full rounded-lg border border-border bg-base px-3 py-2 text-sm text-ink focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
                            />
                            {form.errors.penulis && <p className="mt-1 text-xs text-red-500">{form.errors.penulis}</p>}
                        </div>
                        <div>
                            <label className="text-xs font-medium uppercase tracking-wider text-muted">{t('adminbuku.field.publisher')}</label>
                            <input
                                value={form.data.penerbit}
                                onChange={(e) => form.setData('penerbit', e.target.value)}
                                className="mt-1.5 w-full rounded-lg border border-border bg-base px-3 py-2 text-sm text-ink focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium uppercase tracking-wider text-muted">{t('adminbuku.field.year')}</label>
                            <input
                                type="number"
                                value={form.data.tahun_terbit}
                                onChange={(e) => form.setData('tahun_terbit', e.target.value)}
                                className="mt-1.5 w-full rounded-lg border border-border bg-base px-3 py-2 text-sm text-ink focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium uppercase tracking-wider text-muted">{t('adminbuku.field.isbn')}</label>
                            <input
                                value={form.data.isbn}
                                onChange={(e) => form.setData('isbn', e.target.value)}
                                className="mt-1.5 w-full rounded-lg border border-border bg-base px-3 py-2 text-sm text-ink focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
                            />
                            {form.errors.isbn && <p className="mt-1 text-xs text-red-500">{form.errors.isbn}</p>}
                        </div>
                        <div>
                            <label className="text-xs font-medium uppercase tracking-wider text-muted">{t('adminbuku.field.shelf')}</label>
                            <div className="mt-1.5">
                                <SearchableSelect
                                    value={form.data.rak_id}
                                    onChange={(val) => form.setData('rak_id', val)}
                                    options={rakOptions}
                                    searchPlaceholder={t('common.search')}
                                    emptyText={t('common.noResults')}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-medium uppercase tracking-wider text-muted">{t('adminbuku.field.totalStock')}</label>
                            <input
                                type="number"
                                min={0}
                                value={form.data.total_stok}
                                onChange={(e) => form.setData('total_stok', Number(e.target.value))}
                                className="mt-1.5 w-full rounded-lg border border-border bg-base px-3 py-2 text-sm text-ink focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
                            />
                            {form.errors.total_stok && <p className="mt-1 text-xs text-red-500">{form.errors.total_stok}</p>}
                        </div>
                        <div>
                            <label className="text-xs font-medium uppercase tracking-wider text-muted">{t('adminbuku.field.availableStock')}</label>
                            <input
                                type="number"
                                min={0}
                                value={form.data.stok_tersedia}
                                onChange={(e) => form.setData('stok_tersedia', Number(e.target.value))}
                                className="mt-1.5 w-full rounded-lg border border-border bg-base px-3 py-2 text-sm text-ink focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
                            />
                            {form.errors.stok_tersedia && <p className="mt-1 text-xs text-red-500">{form.errors.stok_tersedia}</p>}
                        </div>
                        <div>
                            <label className="text-xs font-medium uppercase tracking-wider text-muted">{t('adminbuku.field.condition')}</label>
                            <div className="mt-1.5">
                                <SearchableSelect
                                    value={form.data.kondisi}
                                    onChange={(val) => form.setData('kondisi', val)}
                                    options={kondisiOptions}
                                    searchPlaceholder={t('common.search')}
                                    emptyText={t('common.noResults')}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-medium uppercase tracking-wider text-muted">{t('adminbuku.field.language')}</label>
                            <input
                                value={form.data.bahasa}
                                onChange={(e) => form.setData('bahasa', e.target.value)}
                                className="mt-1.5 w-full rounded-lg border border-border bg-base px-3 py-2 text-sm text-ink focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-medium uppercase tracking-wider text-muted">{t('adminbuku.field.synopsis')}</label>
                        <textarea
                            value={form.data.deskripsi}
                            onChange={(e) => form.setData('deskripsi', e.target.value)}
                            rows={4}
                            className="mt-1.5 w-full resize-none rounded-lg border border-border bg-base px-3 py-2 text-sm text-ink focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium uppercase tracking-wider text-muted">{t('adminbuku.field.categories')}</label>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {kategoriList.map((k) => (
                                <button
                                    key={k.id}
                                    type="button"
                                    onClick={() => toggleKategori(k.id)}
                                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                                        form.data.kategori_ids.includes(k.id)
                                            ? 'border-accent/40 bg-accent/10 text-accent'
                                            : 'border-border text-muted hover:text-ink'
                                    }`}
                                >
                                    {k.nama_kategori}
                                </button>
                            ))}
                        </div>
                        {form.errors.kategori_ids && <p className="mt-1 text-xs text-red-500">{form.errors.kategori_ids}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={form.processing}
                        className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                    >
                        <Save size={15} /> {form.processing ? t('adminbuku.saving') : t('adminbuku.save')}
                    </button>
                </form>
            </div>
        </div>
    );
}

BukuForm.layout = (page) => (
    <AuthenticatedLayout titleKey={page.props.buku ? 'adminbuku.form.editTitle' : 'adminbuku.form.createTitle'}>
        {page}
    </AuthenticatedLayout>
);

export default BukuForm;
