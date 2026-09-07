import { useState } from 'react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { useConfirm } from '@/Hooks/useConfirm';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useLanguage } from '@/Contexts/LanguageContext';

function KategoriIndex({ kategori }) {
    const { t } = useLanguage();
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ nama_kategori: '', deskripsi: '' });
    const [saving, setSaving] = useState(false);
    const { confirmState, confirm, handleConfirm, handleCancel } = useConfirm();

    const bukaForm = (k = null) => {
        if (k) {
            setEditing(k.id);
            setForm({ nama_kategori: k.nama_kategori, deskripsi: k.deskripsi || '' });
        } else {
            setEditing(null);
            setForm({ nama_kategori: '', deskripsi: '' });
        }
        setShowForm(true);
    };

    const simpan = () => {
        setSaving(true);
        const opts = { preserveScroll: true, onSuccess: () => setShowForm(false), onFinish: () => setSaving(false) };
        if (editing) {
            router.patch(`/admin/kategori/${editing}`, form, opts);
        } else {
            router.post('/admin/kategori', form, opts);
        }
    };

    const hapus = async (id, nama) => {
        const ok = await confirm(t('adminkategori.confirmDelete.title'), t('adminkategori.confirmDelete.message', { nama }));
        if (ok) {
            router.delete(`/admin/kategori/${id}`, { preserveScroll: true });
        }
    };

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-ink">{t('adminkategori.title')}</h2>
                    <p className="text-sm text-muted">{t('adminkategori.subtitle')}</p>
                </div>
                <button
                    onClick={() => bukaForm()}
                    className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
                >
                    <Plus size={15} /> {t('adminkategori.add')}
                </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {kategori.map((k) => (
                    <div key={k.id} className="rounded-2xl border border-border bg-surface p-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-semibold text-ink">{k.nama_kategori}</p>
                                <p className="mt-0.5 text-xs text-muted">{t('adminkategori.booksCount', { count: k.buku_count })}</p>
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => bukaForm(k)}
                                    className="rounded-md p-1.5 text-muted hover:bg-surface2 hover:text-ink"
                                >
                                    <Pencil size={13} />
                                </button>
                                <button
                                    onClick={() => hapus(k.id, k.nama_kategori)}
                                    className="rounded-md p-1.5 text-muted hover:bg-red-500/10 hover:text-red-500"
                                >
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        </div>
                        {k.deskripsi && <p className="mt-2 text-xs text-muted">{k.deskripsi}</p>}
                    </div>
                ))}
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div onClick={() => setShowForm(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                    <div className="relative w-full max-w-sm rounded-2xl border border-border bg-surface p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <p className="text-sm font-semibold text-ink">{editing ? t('adminkategori.editTitle') : t('adminkategori.createTitle')}</p>
                            <button onClick={() => setShowForm(false)} className="text-muted hover:text-ink">
                                <X size={16} />
                            </button>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-medium uppercase tracking-wider text-muted">{t('adminkategori.field.name')}</label>
                                <input
                                    value={form.nama_kategori}
                                    onChange={(e) => setForm((f) => ({ ...f, nama_kategori: e.target.value }))}
                                    className="mt-1.5 w-full rounded-lg border border-border bg-base px-3 py-2 text-sm text-ink focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium uppercase tracking-wider text-muted">{t('adminkategori.field.desc')}</label>
                                <textarea
                                    value={form.deskripsi}
                                    onChange={(e) => setForm((f) => ({ ...f, deskripsi: e.target.value }))}
                                    rows={2}
                                    className="mt-1.5 w-full resize-none rounded-lg border border-border bg-base px-3 py-2 text-sm text-ink focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
                                />
                            </div>
                            <button
                                onClick={simpan}
                                disabled={saving}
                                className="w-full rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                            >
                                {saving ? t('adminkategori.saving') : t('adminkategori.save')}
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

KategoriIndex.layout = (page) => <AuthenticatedLayout titleKey="adminkategori.title">{page}</AuthenticatedLayout>;

export default KategoriIndex;
