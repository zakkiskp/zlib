import { useState } from 'react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { useConfirm } from '@/Hooks/useConfirm';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useLanguage } from '@/Contexts/LanguageContext';

function KategoriRak({ raks, kategori }) {
    const { t } = useLanguage();
    const [showForm, setShowForm] = useState(false);
    const [editingRak, setEditingRak] = useState(null);
    const [form, setForm] = useState({ kode_rak: '', lokasi: '', keterangan: '', kapasitas: 50 });
    const [saving, setSaving] = useState(false);
    const { confirmState, confirm, handleConfirm, handleCancel } = useConfirm();

    const bukaForm = (rak = null) => {
        if (rak) {
            setEditingRak(rak.id);
            setForm({ kode_rak: rak.kode_rak, lokasi: rak.lokasi, keterangan: rak.keterangan || '', kapasitas: rak.kapasitas });
        } else {
            setEditingRak(null);
            setForm({ kode_rak: '', lokasi: '', keterangan: '', kapasitas: 50 });
        }
        setShowForm(true);
    };

    const simpan = () => {
        setSaving(true);
        const opts = { preserveScroll: true, onSuccess: () => setShowForm(false), onFinish: () => setSaving(false) };
        if (editingRak) {
            router.patch(`/rak/${editingRak}`, form, opts);
        } else {
            router.post('/rak', form, opts);
        }
    };

    const hapus = async (id, kode) => {
        const ok = await confirm(t('kategorirak.confirmDelete.title'), t('kategorirak.confirmDelete.message', { kode }));
        if (ok) {
            router.delete(`/rak/${id}`, { preserveScroll: true });
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-ink">{t('kategorirak.title')}</h2>
                <p className="text-sm text-muted">{t('kategorirak.subtitle')}</p>
            </div>

            <div>
                <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-semibold text-ink">{t('kategorirak.shelves')}</p>
                    <button
                        onClick={() => bukaForm()}
                        className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white"
                    >
                        <Plus size={13} /> {t('kategorirak.addShelf')}
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {raks.map((r) => (
                        <div key={r.id} className="rounded-2xl border border-border bg-surface p-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-mono text-sm font-semibold text-ink">{r.kode_rak}</p>
                                    <p className="text-xs text-muted">{r.lokasi}</p>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => bukaForm(r)}
                                        className="rounded-md p-1.5 text-muted hover:bg-surface2 hover:text-ink"
                                    >
                                        <Pencil size={13} />
                                    </button>
                                    <button
                                        onClick={() => hapus(r.id, r.kode_rak)}
                                        className="rounded-md p-1.5 text-muted hover:bg-red-500/10 hover:text-red-500"
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            </div>
                            <p className="mt-2 text-xs text-muted">
                                {t('kategorirak.booksCount', { count: r.buku_count, kapasitas: r.kapasitas })}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <p className="mb-3 text-sm font-semibold text-ink">{t('kategorirak.categories')}</p>
                <div className="flex flex-wrap gap-2">
                    {kategori.map((k) => (
                        <span key={k.id} className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted">
                            {k.nama_kategori} <span className="text-ink">({k.buku_count})</span>
                        </span>
                    ))}
                </div>
                <p className="mt-2 text-xs text-muted/70">{t('kategorirak.categoryHint')}</p>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div onClick={() => setShowForm(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                    <div className="relative w-full max-w-sm rounded-2xl border border-border bg-surface p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <p className="text-sm font-semibold text-ink">{editingRak ? t('kategorirak.editShelf') : t('kategorirak.addShelf')}</p>
                            <button onClick={() => setShowForm(false)} className="text-muted hover:text-ink">
                                <X size={16} />
                            </button>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-medium uppercase tracking-wider text-muted">{t('kategorirak.field.code')}</label>
                                <input
                                    value={form.kode_rak}
                                    onChange={(e) => setForm((f) => ({ ...f, kode_rak: e.target.value }))}
                                    className="mt-1.5 w-full rounded-lg border border-border bg-base px-3 py-2 text-sm text-ink focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium uppercase tracking-wider text-muted">{t('kategorirak.field.location')}</label>
                                <input
                                    value={form.lokasi}
                                    onChange={(e) => setForm((f) => ({ ...f, lokasi: e.target.value }))}
                                    className="mt-1.5 w-full rounded-lg border border-border bg-base px-3 py-2 text-sm text-ink focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium uppercase tracking-wider text-muted">{t('kategorirak.field.capacity')}</label>
                                <input
                                    type="number"
                                    min={1}
                                    value={form.kapasitas}
                                    onChange={(e) => setForm((f) => ({ ...f, kapasitas: Number(e.target.value) }))}
                                    className="mt-1.5 w-full rounded-lg border border-border bg-base px-3 py-2 text-sm text-ink focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
                                />
                            </div>
                            <button
                                onClick={simpan}
                                disabled={saving}
                                className="w-full rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                            >
                                {saving ? t('kategorirak.saving') : t('kategorirak.save')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

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

KategoriRak.layout = (page) => <AuthenticatedLayout title="Kategori & Rak">{page}</AuthenticatedLayout>;

export default KategoriRak;
