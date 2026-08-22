import { useRef, useState, useEffect } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useConfirm } from '@/Hooks/useConfirm';
import { resolveMediaUrl, inputClass } from '@/Utils/ui';
import {
  Megaphone,
  Plus,
  Pencil,
  Trash2,
  ImagePlus,
  X,
  CalendarDays,
  Info,
  Sparkles,
  AlertTriangle,
  Loader2,
} from 'lucide-react';

const TYPE_META = {
  info: { label: 'Info', icon: Info, className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  promo: { label: 'Promo', icon: Sparkles, className: 'bg-accent/10 text-accent' },
  warning: { label: 'Peringatan', icon: AlertTriangle, className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
};

// Helper untuk memotong format tanggal database (YYYY-MM-DDTHH:mm...) menjadi YYYY-MM-DD
function formatDateForInput(dateString) {
  if (!dateString) return '';
  return dateString.split('T')[0];
}

function AnnouncementModal({ open, onClose, editingItem }) {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const form = useForm({
    title: '',
    content: '',
    type: 'info',
    start_date: '',
    end_date: '',
    is_active: true,
    banner_image: null,
  });

  useEffect(() => {
    if (editingItem) {
      form.setData({
        title: editingItem.title || '',
        content: editingItem.content || '',
        type: editingItem.type || 'info',
        start_date: formatDateForInput(editingItem.start_date),
        end_date: formatDateForInput(editingItem.end_date),
        is_active: editingItem.is_active ?? true,
        banner_image: null,
      });
      setPreview(resolveMediaUrl(editingItem.banner_image));
    } else {
      form.reset();
      setPreview(null);
    }
  }, [editingItem, open]);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    form.setData('banner_image', file);
    setPreview(URL.createObjectURL(file));
  }

  function submit(e) {
    e.preventDefault();
    if (editingItem) {
      form.transform((data) => ({
        ...data,
        _method: 'PUT',
      }));
      form.post(route('admin.announcements.update', editingItem.id), {
        forceFormData: true,
        preserveScroll: true,
        onSuccess: () => onClose(),
      });
    } else {
      form.post(route('admin.announcements.store'), {
        forceFormData: true,
        preserveScroll: true,
        onSuccess: () => onClose(),
      });
    }
  }

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.form
          onSubmit={submit}
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
          className="w-full max-w-lg rounded-2xl bg-surface border border-border shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-ink">
              {editingItem ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}
            </h3>
            <button type="button" onClick={onClose} className="text-muted hover:text-ink">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Banner Gambar</label>
              <div
                onClick={() => fileRef.current?.click()}
                className="cursor-pointer rounded-xl border-2 border-dashed border-border hover:border-accent transition-colors h-32 flex items-center justify-center overflow-hidden bg-base"
              >
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-muted">
                    <ImagePlus className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-xs">Klik untuk upload banner</span>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
              {form.errors.banner_image && <p className="mt-1 text-xs text-red-500">{form.errors.banner_image}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Judul</label>
              <input
                type="text"
                className={inputClass}
                value={form.data.title}
                onChange={(e) => form.setData('title', e.target.value)}
              />
              {form.errors.title && <p className="mt-1 text-xs text-red-500">{form.errors.title}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Isi Pengumuman</label>
              <textarea
                rows={3}
                className={inputClass}
                value={form.data.content}
                onChange={(e) => form.setData('content', e.target.value)}
              />
              {form.errors.content && <p className="mt-1 text-xs text-red-500">{form.errors.content}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">Tipe</label>
                <select
                  className={inputClass}
                  value={form.data.type}
                  onChange={(e) => form.setData('type', e.target.value)}
                >
                  <option value="info">Info</option>
                  <option value="promo">Promo</option>
                  <option value="warning">Peringatan</option>
                </select>
              </div>
              <div className="flex items-end pb-2.5">
                <label className="flex items-center gap-2 text-sm text-ink cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.data.is_active}
                    onChange={(e) => form.setData('is_active', e.target.checked)}
                    className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                  />
                  Aktifkan sekarang
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">Tanggal Mulai</label>
                <input
                  type="date"
                  className={inputClass}
                  value={form.data.start_date}
                  onChange={(e) => form.setData('start_date', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">Tanggal Berakhir</label>
                <input
                  type="date"
                  className={inputClass}
                  value={form.data.end_date}
                  onChange={(e) => form.setData('end_date', e.target.value)}
                />
                {form.errors.end_date && <p className="mt-1 text-xs text-red-500">{form.errors.end_date}</p>}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-muted rounded-lg border border-border hover:bg-surface2 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={form.processing}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-accent rounded-lg shadow-glow-accent hover:brightness-110 disabled:opacity-60 transition-all"
            >
              {form.processing && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingItem ? 'Simpan Perubahan' : 'Publikasikan'}
            </button>
          </div>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
}

function AnnouncementCard({ item, onEdit, onDelete }) {
  const meta = TYPE_META[item.type] || TYPE_META.info;
  const Icon = meta.icon;
  const bannerUrl = resolveMediaUrl(item.banner_image);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="rounded-2xl border border-border/70 bg-surface/70 backdrop-blur-md overflow-hidden group"
    >
      <div className="h-32 bg-surface2 relative overflow-hidden">
        {bannerUrl ? (
          <img
            src={bannerUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted">
            <Megaphone className="w-8 h-8" />
          </div>
        )}
        <span
          className={`absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md ${meta.className}`}
        >
          <Icon className="w-3 h-3" />
          {meta.label}
        </span>
        {!item.is_active && (
          <span className="absolute top-2.5 right-2.5 rounded-full bg-zinc-900/70 text-white text-[10px] font-semibold px-2 py-1">
            Nonaktif
          </span>
        )}
      </div>
      <div className="p-4">
        <h4 className="font-semibold text-sm text-ink line-clamp-1">{item.title}</h4>
        <p className="text-xs text-muted mt-1 line-clamp-2">{item.content}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-[11px] text-muted">
            <CalendarDays className="w-3 h-3" />
            {formatDateForInput(item.start_date) || '—'} s/d {formatDateForInput(item.end_date) || '—'}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(item)}
              className="p-1.5 rounded-md text-muted hover:text-accent hover:bg-accent/10 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(item)}
              className="p-1.5 rounded-md text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function AnnouncementIndex({ announcements }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const { confirm } = useConfirm();
  const { flash } = usePage().props;

  function openCreate() {
    setEditingItem(null);
    setModalOpen(true);
  }

  function openEdit(item) {
    setEditingItem(item);
    setModalOpen(true);
  }

  async function handleDelete(item) {
    const ok = await confirm(
      'Hapus Pengumuman?',
      `Pengumuman "${item.title}" akan dihapus permanen dan tidak akan tampil lagi di dashboard anggota.`
    );
    if (ok) {
      router.delete(route('admin.announcements.destroy', item.id), { preserveScroll: true });
    }
  }

  return (
    <AuthenticatedLayout>
      <Head title="Pengumuman" />

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-ink">Announcement & Broadcast Manager</h1>
              <p className="text-sm text-muted">
                Kelola banner pengumuman yang tampil di dashboard Anggota.
              </p>
            </div>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-glow-accent hover:brightness-110 active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4" />
            Buat Pengumuman
          </button>
        </div>

        {flash?.success && (
          <div className="mb-5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
            {flash.success}
          </div>
        )}

        {announcements.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted">
            <Megaphone className="w-8 h-8 mx-auto mb-2" />
            Belum ada pengumuman. Klik "Buat Pengumuman" untuk membuat yang pertama.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence>
              {announcements.map((item) => (
                <AnnouncementCard key={item.id} item={item} onEdit={openEdit} onDelete={handleDelete} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnnouncementModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editingItem={editingItem}
      />
    </AuthenticatedLayout>
  );
}