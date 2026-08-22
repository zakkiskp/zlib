import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Bookmark, Save, FileWarning } from 'lucide-react';

export default function PdfReaderPanel({ buku, halamanTerakhir, catatanBacaan }) {
    const [halaman, setHalaman] = useState(halamanTerakhir || 1);
    const [catatan, setCatatan] = useState(catatanBacaan || '');
    const [saving, setSaving] = useState(false);
    const [tersimpan, setTersimpan] = useState(false);

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

    const punyaFile = Boolean(buku.file_pdf_url);

    return (
        <div className="flex flex-1 overflow-hidden">
            {/* Viewer — pakai PDF viewer bawaan browser, zoom & navigasi halaman otomatis
                tersedia tanpa library tambahan. #page=N langsung buka di halaman terakhir. */}
            <div className="flex-1 bg-surface2">
                {punyaFile ? (
                    <iframe
                        title={buku.judul_buku}
                        src={`${buku.file_pdf_url}#page=${halaman}`}
                        className="h-full w-full border-0"
                    />
                ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 p-10 text-center">
                        <FileWarning size={32} className="text-muted" />
                        <p className="text-sm font-medium text-ink">File PDF belum diunggah</p>
                        <p className="max-w-sm text-xs text-muted">
                            Admin belum mengunggah file baca-online untuk buku ini. Begitu file-nya tersedia,
                            zoom & navigasi halaman langsung aktif otomatis.
                        </p>
                    </div>
                )}
            </div>

            {/* Sidebar bookmark & catatan */}
            <div className="hidden w-72 shrink-0 space-y-4 overflow-y-auto border-l border-border bg-surface p-4 md:block">
                <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-muted">Halaman Terakhir</label>
                    <input
                        type="number"
                        min={1}
                        value={halaman}
                        onChange={(e) => setHalaman(Number(e.target.value))}
                        className="mt-1.5 w-full rounded-lg border border-border bg-base px-3 py-2 text-sm text-ink focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
                    />
                </div>

                <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-muted">Catatan Bacaan</label>
                    <textarea
                        rows={8}
                        value={catatan}
                        onChange={(e) => setCatatan(e.target.value)}
                        placeholder="Tulis catatan pribadi tentang buku ini…"
                        className="mt-1.5 w-full resize-none rounded-lg border border-border bg-base px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
                    />
                </div>

                <button
                    onClick={simpanBookmark}
                    disabled={saving}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                >
                    <Bookmark size={15} /> {saving ? 'Menyimpan…' : 'Simpan Bookmark'}
                </button>

                {tersimpan && (
                    <p className="flex items-center gap-1.5 text-xs text-emerald-500">
                        <Save size={12} /> Bookmark tersimpan.
                    </p>
                )}
            </div>
        </div>
    );
}
