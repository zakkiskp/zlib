import { useRef, useState, useEffect } from 'react';
import { useForm, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SearchableSelect from '@/Components/SearchableSelect';
import { useLanguage } from '@/Contexts/LanguageContext';
import { inputClass } from '@/Utils/ui';
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

const TYPE_ICON = { info: Info, promo: Sparkles, warning: AlertTriangle };
const TYPE_CLASS = {
  info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  promo: 'bg-accent/10 text-accent',
  warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
};

function formatDateForInput(dateString) {
  if (!dateString) return '';
  if (typeof dateString === 'string') {
    return dateString.split('T')[0].split(' ')[0];
  }
  return '';
}

function resolveBannerUrl(path) {
  if (!path) return null;
  return path.startsWith('http') ? path : `/storage/${path}`;
}

function AnnouncementModal({ open, onClose, editingItem, t }) {
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

  const typeOptions = [
    { value: 'info', label: t('announcement.type.info') },
    { value: 'promo', label: t('announcement.type.promo') },
    { value: 'warning', label: t('announcement.type.warning') },
  ];

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
      setPreview(resolveBannerUrl(editingItem.banner_image));
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
              {editingItem ? t('announcement.modal.edit') : t('announcement.modal.create')}
            </h3>
            <button type="button" onClick={onClose} className="text-muted hover:text-ink">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">{t('announcement.field.banner')}</label>
              <div
                onClick={() => fileRef.current?.click()}
                className="cursor-pointer rounded-xl border-2 border-dashed border-border hover:border-accent transition-colors flex items-center justify-center overflow-hidden p-2 bg-transparent"
              >
                {preview ? (
                  <img src={preview} alt="Preview" className="w-auto h-auto max-h-72 object-contain rounded-lg mx-auto" />
                ) : (
                  <div className="text-center text-muted py-8">
                    <ImagePlus className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-xs">{t('announcement.field.bannerHint')}</span>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
              {form.errors.banner_image && <p className="mt-1 text-xs text-red-500">{form.errors.banner_image}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">{t('announcement.field.title')}</label>
              <input
                type="text"
                className={inputClass}
                value={form.data.title}
                onChange={(e) => form.setData('title', e.target.value)}
              />
              {form.errors.title && <p className="mt-1 text-xs text-red-500">{form.errors.title}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">{t('announcement.field.content')}</label>
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
                <label className="block text-xs font-medium text-muted mb-1.5">{t('announcement.field.type')}</label>
                <SearchableSelect
                  value={form.data.type}
                  onChange={(val) => form.setData('type', val)}
                  options={typeOptions}
                  searchPlaceholder={t('announcement.searchType.placeholder')}
                  emptyText={t('common.noResults')}
                />
              </div>
              <div className="flex items-end pb-2.5">
                <label className="flex items-center gap-2 text-sm text-ink cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.data.is_active}
                    onChange={(e) => form.setData('is_active', e.target.checked)}
                    className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                  />
                  {t('announcement.field.activate')}
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">{t('announcement.field.startDate')}</label>
                <input
                  type="date"
                  className={inputClass}
                  value={form.data.start_date}
                  onChange={(e) => form.setData('start_date', e.target.value)}
                />
                {form.errors.start_date && <p className="mt-1 text-xs text-red-500">{form.errors.start_date}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">{t('announcement.field.endDate')}</label>
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
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={form.processing}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-accent rounded-lg shadow-glow-accent hover:brightness-110 disabled:opacity-60 transition-all"
            >
              {form.processing && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingItem ? t('announcement.save.edit') : t('announcement.save.create')}
            </button>
          </div>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
}

function AnnouncementCard({ item, onEdit, onDelete, t }) {
  const Icon = TYPE_ICON[item.type] || Info;
  const badgeClass = TYPE_CLASS[item.type] || TYPE_CLASS.info;
  const typeLabel = t(`announcement.type.${item.type}`);
  const bannerUrl = resolveBannerUrl(item.banner_image);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="rounded-2xl border border-border/70 bg-surface/70 backdrop-blur-md overflow-hidden group flex flex-col"
    >
      <div className="w-full relative overflow-hidden flex items-center justify-center p-3 bg-transparent">
        {bannerUrl ? (
          <img
            src={bannerUrl}
            alt={item.title}
            className="w-auto h-auto max-h-80 object-contain rounded-xl group-hover:scale-[1.02] transition-transform duration-300 mx-auto"
          />
        ) : (
          <div className="w-full h-32 flex items-center justify-center text-muted">
            <Megaphone className="w-8 h-8" />
          </div>
        )}
        <span
          className={`absolute top-4 left-4 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md shadow-sm ${badgeClass}`}
        >
          <Icon className="w-3 h-3" />
          {typeLabel}
        </span>
        {!item.is_active && (
          <span className="absolute top-4 right-4 rounded-full bg-zinc-900/70 text-white text-[10px] font-semibold px-2 py-1 shadow-sm">
            {t('announcement.badge.inactive')}
          </span>
        )}
      </div>
      <div className="p-4 mt-auto border-t border-border/40">
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
  const { t } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const { flash } = usePage().props;

  function openCreate() {
    setEditingItem(null);
    setModalOpen(true);
  }

  function openEdit(item) {
    setEditingItem(item);
    setModalOpen(true);
  }

  function confirmDelete(item) {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  }

  function executeDelete() {
    if (itemToDelete) {
      router.delete(route('admin.announcements.destroy', itemToDelete.id), {
        preserveScroll: true,
        onSuccess: () => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        },
      });
    }
  }

  return (
    <AuthenticatedLayout titleKey="announcement.title">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-ink">{t('announcement.title')}</h1>
              <p className="text-sm text-muted">{t('announcement.subtitle')}</p>
            </div>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-glow-accent hover:brightness-110 active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4" />
            {t('announcement.create')}
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
            {t('announcement.empty')}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence>
              {announcements.map((item) => (
                <AnnouncementCard key={item.id} item={item} onEdit={openEdit} onDelete={confirmDelete} t={t} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnnouncementModal open={modalOpen} onClose={() => setModalOpen(false)} editingItem={editingItem} t={t} />

      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-surface border border-border shadow-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-ink mb-1">{t('announcement.deleteModal.title')}</h3>
            <p className="text-xs text-muted mb-6">
              {t('announcement.deleteModal.message', { title: itemToDelete?.title })}
            </p>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-muted rounded-xl border border-border hover:bg-surface2 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={executeDelete}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors shadow-lg"
              >
                {t('announcement.deleteModal.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}