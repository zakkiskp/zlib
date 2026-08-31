import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Info, Sparkles, AlertTriangle, Megaphone } from 'lucide-react';
import { useLanguage } from '@/Contexts/LanguageContext';

/**
 * TASK #3 — Integrasi Pengumuman ke Dashboard/Notifikasi Anggota.
 *
 * Komponen ini BACA dari prop global `activeAnnouncements` yang di-share
 * lewat HandleInertiaRequests (lihat PATCH-handle-inertia-requests.php di
 * paket ini untuk snippet-nya). Kenapa lewat shared prop, bukan bikin baris
 * baru di tabel notifikasi? Karena saya tidak tahu skema tabel `notifikasi`
 * Anda (kolom apa saja) — menebak nama kolom lalu INSERT bisa berujung
 * error yang sama seperti kasus `audit_logs` kemarin. Pendekatan "live
 * query" ini 100% aman karena tidak perlu tahu skema tabel lain sama sekali,
 * selalu real-time reflect pengumuman yang sedang aktif tanpa perlu sinkron.
 *
 * Cara pakai — taruh satu baris ini di bagian ATAS Dashboard Anggota:
 *   import AnnouncementBanner from '@/Components/AnnouncementBanner';
 *   ...
 *   <AnnouncementBanner />
 *
 * Kalau ada lebih dari 1 pengumuman aktif, otomatis jadi carousel kecil
 * dengan dot indicator. Sekali di-dismiss (tombol X), tidak akan muncul
 * lagi untuk pengumuman ITU SAJA (disimpan di localStorage per browser) —
 * begitu ada pengumuman baru dari Admin, otomatis muncul lagi.
 */

const TYPE_ICON = { info: Info, promo: Sparkles, warning: AlertTriangle };
const TYPE_CLASS = {
  info: 'bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300',
  promo: 'bg-accent/10 border-accent/30 text-accent',
  warning: 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300',
};

const DISMISSED_KEY = 'zlib_dismissed_announcements';

function resolveBannerUrl(path) {
  if (!path) return null;
  return path.startsWith('http') ? path : `/storage/${path}`;
}

export default function AnnouncementBanner() {
  const { props } = usePage();
  const { t } = useLanguage();
  const announcements = props.activeAnnouncements || [];

  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem(DISMISSED_KEY) || '[]');
    } catch {
      return [];
    }
  });
  const [index, setIndex] = useState(0);

  const visible = announcements.filter((a) => !dismissed.includes(a.id));

  useEffect(() => {
    if (index >= visible.length) setIndex(0);
  }, [visible.length, index]);

  function dismiss(id) {
    const next = [...dismissed, id];
    setDismissed(next);
    try {
      localStorage.setItem(DISMISSED_KEY, JSON.stringify(next));
    } catch {
      // storage penuh/diblokir browser - abaikan, cukup state React yang jalan
    }
  }

  if (visible.length === 0) return null;

  const item = visible[index];
  const Icon = TYPE_ICON[item.type] || Megaphone;
  const badgeClass = TYPE_CLASS[item.type] || TYPE_CLASS.info;
  const bannerUrl = resolveBannerUrl(item.banner_image);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
        className={`relative rounded-2xl border overflow-hidden mb-5 ${badgeClass}`}
      >
        <div className="flex items-stretch">
          {bannerUrl && (
            <div className="hidden sm:block w-32 shrink-0">
              <img src={bannerUrl} alt={item.title} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1 p-4 flex items-center gap-3 min-w-0">
            <Icon className="w-5 h-5 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm truncate">{item.title}</p>
              <p className="text-xs opacity-80 line-clamp-1">{item.content}</p>
            </div>
            {visible.length > 1 && (
              <span className="hidden sm:block shrink-0 text-xs opacity-70">
                {index + 1}/{visible.length}
              </span>
            )}
            <button
              onClick={() => dismiss(item.id)}
              className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0"
              title={t('common.close')}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        {visible.length > 1 && (
          <div className="flex justify-center gap-1 pb-2">
            {visible.map((a, i) => (
              <button
                key={a.id}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${i === index ? 'bg-current w-4' : 'bg-current opacity-30 w-1.5'}`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
