import { useState } from 'react';
import { Megaphone, Info, Sparkles, AlertTriangle, X } from 'lucide-react';
import { useLanguage } from '@/Contexts/LanguageContext';

/**
 * REVISI UI: sebelumnya cuma nampilin judul+konten polos, `gambar` dari
 * DashboardController tidak pernah dipakai. Sekarang:
 * - Gambar banner ditampilkan kalau ada (dengan fallback aman kalau tidak)
 * - Warna/ikon menyesuaikan tipe pengumuman (info/promo/warning), konsisten
 *   dengan Announcement Manager di Admin
 * - Bisa di-tutup (dismiss) per sesi — tidak permanen, muncul lagi kalau
 *   halaman di-refresh (pengumuman aktif memang sengaja selalu "reappear"
 *   supaya anggota tidak kelewat info penting)
 */
const TYPE_ICON = { info: Info, promo: Sparkles, warning: AlertTriangle };
const TYPE_CLASS = {
  info: 'border-blue-500/20 bg-blue-500/[0.06] hover:border-blue-500/40',
  promo: 'border-accent/20 bg-accent/[0.06] hover:border-accent/40',
  warning: 'border-amber-500/20 bg-amber-500/[0.06] hover:border-amber-500/40',
};
const ICON_WRAP_CLASS = {
  info: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  promo: 'bg-accent/15 text-accent',
  warning: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
};

function resolveBannerUrl(path) {
  if (!path) return null;
  return path.startsWith('http') ? path : `/storage/${path}`;
}

export default function AnnouncementBanner({ data }) {
  const { t } = useLanguage();
  const [dismissed, setDismissed] = useState(false);

  if (!data || dismissed) return null;

  const type = data.tipe || 'info';
  const Icon = TYPE_ICON[type] || Megaphone;
  const cardClass = TYPE_CLASS[type] || TYPE_CLASS.info;
  const iconWrapClass = ICON_WRAP_CLASS[type] || ICON_WRAP_CLASS.info;
  const bannerUrl = resolveBannerUrl(data.gambar);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-6 transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-glow-accent ${cardClass}`}
    >
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg text-muted hover:bg-black/5 dark:hover:bg-white/10 hover:text-ink transition-colors"
        title={t('common.close')}
      >
        <X size={14} />
      </button>

      <div className="flex items-start gap-4 pr-8">
        {bannerUrl && (
          <img
            src={bannerUrl}
            alt={data.judul}
            className="hidden sm:block h-16 w-16 shrink-0 rounded-xl object-cover ring-1 ring-border"
          />
        )}
        <div className="flex items-start gap-3 min-w-0">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconWrapClass}`}>
            <Icon size={17} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink">{data.judul}</p>
            <p className="mt-1 text-sm text-muted line-clamp-2">{data.konten}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
