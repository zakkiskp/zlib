import { useState } from 'react';
import { router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bookmark, Save, FileWarning, NotebookPen, X } from 'lucide-react';
import { useLanguage } from '@/Contexts/LanguageContext';

/**
 * Form bookmark & catatan bacaan — dipakai sama persis di sidebar desktop
 * maupun bottom-sheet mobile, supaya perilaku & teksnya selalu konsisten
 * (satu sumber kebenaran, tidak ada duplikasi logic).
 */
function BookmarkForm({ t, halaman, setHalaman, catatan, setCatatan, saving, tersimpan, onSimpan }) {
    return (
        <div className="space-y-4">
            <div>
                <label className="text-xs font-medium uppercase tracking-wider text-muted">
                    {t('katalog.reader.lastPage')}
                </label>
                <input
                    type="number"
                    min={1}
                    value={halaman}
                    onChange={(e) => setHalaman(Number(e.target.value))}
                    className="mt-1.5 w-full rounded-lg border border-border bg-base px-3 py-2 text-sm text-ink focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
            </div>

            <div>
                <label className="text-xs font-medium uppercase tracking-wider text-muted">
                    {t('katalog.reader.notes')}
                </label>
                <textarea
                    rows={8}
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    placeholder={t('katalog.reader.notesPlaceholder')}
                    className="mt-1.5 w-full resize-none rounded-lg border border-border bg-base px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
            </div>

            <button
                onClick={onSimpan}
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
                <Bookmark size={15} /> {saving ? t('katalog.detail.saving') : t('katalog.reader.saveBookmark')}
            </button>

            {tersimpan && (
                <p className="flex items-center gap-1.5 text-xs text-emerald-500">
                    <Save size={12} /> {t('katalog.reader.saved')}
                </p>
            )}
        </div>
    );
}

export default function PdfReaderPanel({ buku, halamanTerakhir, catatanBacaan }) {
    const { t, lang } = useLanguage();
    const [halaman, setHalaman] = useState(halamanTerakhir || 1);
    const [catatan, setCatatan] = useState(catatanBacaan || '');
    const [saving, setSaving] = useState(false);
    const [tersimpan, setTersimpan] = useState(false);
    // FIX BUG (responsif mobile): panel bookmark/catatan dulu `hidden
    // md:block` — di HP fiturnya HILANG TOTAL, bukan cuma tersembunyi rapi.
    // Sekarang jadi bottom-sheet yang bisa dibuka lewat FAB, jadi member
    // yang buka dari HP tetap bisa simpan bookmark & catatan.
    const [sheetOpen, setSheetOpen] = useState(false);

    const simpanBookmark = () => {
        setSaving(true);
        setTersimpan(false);
        router.post(
            `/katalog/${buku.id}/bookmark`,
            { halaman_terakhir: halaman, catatan_bacaan: catatan },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => setTersimpan(true),
                onFinish: () => setSaving(false),
            },
        );
    };

    // FIX BUG (isi bacaan PDF tidak ikut i18n): PDF adalah file statis,
    // beda dari komponen React yang otomatis re-render saat tombol ID/EN
    // ditekan. Solusinya: backend sudah menyiapkan DUA file PDF per buku
    // (file_pdf_url = versi ID, file_pdf_url_en = versi EN — lihat
    // SampleBookPdfGenerator.php). Di sini kita tinggal PILIH url yang
    // sesuai dengan `lang` aktif dari LanguageContext. Karena `lang` ada
    // di dependency array useMemo, setiap kali tombol ID/EN diklik di
    // manapun di aplikasi (termasuk tombol yang baru ditambahkan di bilah
    // nav halaman ini sendiri), nilai ini otomatis dihitung ulang, iframe
    // di bawah otomatis dapat `src` baru, dan browser me-render ulang PDF
    // dalam bahasa yang baru — tanpa perlu reload halaman React sama sekali.
    //
    // Fallback: kalau versi EN belum pernah di-generate untuk buku ini
    // (mis. proyek lama yang belum sempat dijalankan ulang
    // `php artisan buku:generate-sample-pdfs --force` setelah update fitur
    // ini), otomatis jatuh ke versi ID supaya pembaca tidak melihat
    // halaman kosong/error hanya karena satu bahasa belum ter-generate.
    const activeFileUrl = lang === 'en'
        ? (buku.file_pdf_url_en || buku.file_pdf_url)
        : buku.file_pdf_url;

    const punyaFile = Boolean(activeFileUrl);

    const formProps = { t, halaman, setHalaman, catatan, setCatatan, saving, tersimpan, onSimpan: simpanBookmark };

    return (
        <div className="relative flex flex-1 overflow-hidden">
            {/* Viewer — pakai PDF viewer bawaan browser, zoom & navigasi halaman otomatis
                tersedia tanpa library tambahan. #page=N langsung buka di halaman terakhir.

                FIX BUG (full-width, sisa ruang kosong kiri-kanan): container
                di sini SUDAH flex-1 (mengisi penuh sisa lebar layar) — bagian
                yang sebelumnya terasa "kosong di sisi kiri-kanan" sebenarnya
                datang dari viewer PDF BAWAAN BROWSER (Chrome PDFium / Firefox
                pdf.js), yang secara default membuka dokumen di zoom
                "fit-page" — untuk halaman buku berorientasi potret yang lebih
                sempit dari lebar layar laptop, itu menyisakan bilah abu-abu
                di kiri-kanan. Kita tidak bisa styling isi iframe PDF lintas
                origin lewat CSS, tapi PDF Open Parameters (#zoom=page-width)
                didukung luas oleh viewer bawaan Chrome & Firefox untuk
                memaksa lebar halaman pas dengan lebar viewer — otomatis
                menghilangkan bilah kosong kiri-kanan itu. */}
            <div className="min-w-0 flex-1 bg-surface2">
                {punyaFile ? (
                    <iframe
                        key={lang}
                        title={buku.judul_buku}
                        src={`${activeFileUrl}#page=${halaman}&zoom=page-width`}
                        className="h-full w-full border-0"
                    />
                ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 p-10 text-center">
                        <FileWarning size={32} className="text-muted" />
                        <p className="text-sm font-medium text-ink">{t('katalog.reader.noFile.title')}</p>
                        <p className="max-w-sm text-xs text-muted">{t('katalog.reader.noFile.desc')}</p>
                    </div>
                )}
            </div>

            {/* Sidebar bookmark & catatan — DESKTOP saja (lg ke atas) */}
            <div className="hidden w-72 shrink-0 space-y-4 overflow-y-auto border-l border-border bg-surface p-4 lg:block">
                <BookmarkForm {...formProps} />
            </div>

            {/* FIX BUG (sangat responsif di mobile): FAB + bottom-sheet
                pengganti sidebar di layar < lg. Tanpa ini fitur bookmark &
                catatan sama sekali tidak bisa diakses dari HP. */}
            <button
                onClick={() => setSheetOpen(true)}
                aria-label={t('katalog.reader.openPanel')}
                className="fixed bottom-5 right-5 z-40 flex h-13 w-13 items-center justify-center rounded-full bg-accent p-3.5 text-white shadow-glow-accent transition-transform active:scale-95 lg:hidden"
            >
                <NotebookPen size={20} />
            </button>

            <AnimatePresence>
                {sheetOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSheetOpen(false)}
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
                            className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl border-t border-border bg-surface p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-soft"
                        >
                            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-border" />
                            <div className="mb-4 flex items-center justify-between">
                                <p className="text-sm font-semibold text-ink">{t('katalog.reader.openPanel')}</p>
                                <button
                                    onClick={() => setSheetOpen(false)}
                                    aria-label={t('common.close')}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-surface2 hover:text-ink"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                            <BookmarkForm {...formProps} />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
