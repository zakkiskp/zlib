import { BookMarked, Users, Clock, Banknote, Activity, ClipboardCheck, AlertTriangle, Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import BentoCard from '@/Components/BentoCard';
import { useLanguage } from '@/Contexts/LanguageContext';

const ICONS = { BookMarked, Users, Clock, Banknote, Activity, ClipboardCheck, AlertTriangle, Wallet };

function formatValue(value, format, locale) {
  if (format === 'rupiah') {
    return 'Rp' + new Intl.NumberFormat(locale).format(value);
  }
  return new Intl.NumberFormat(locale).format(value);
}

export default function StatCard({ label, value, icon, delta, format }) {
  const { t, lang } = useLanguage();
  const Icon = ICONS[icon] ?? Activity;
  const hasDelta = delta !== null && delta !== undefined;
  const isUp = hasDelta && delta >= 0;
  const locale = lang === 'en' ? 'en-US' : 'id-ID';

  // Backend (DashboardController) sekarang mengirim translation KEY untuk
  // label (mis. 'dashboard.admin.stat.totalBooks'), bukan teks mentah lagi
  // — supaya kartu ini otomatis ganti bahasa tanpa perlu ubah backend lagi
  // tiap kali toggle ID/EN. t() otomatis fallback ke string asli kalau
  // dikasih label yang bukan key terdaftar (aman untuk kompatibilitas).
  const resolvedLabel = t(label);

  return (
    <BentoCard>
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
          <Icon size={17} />
        </div>
        {hasDelta && (
          <span
            className={`flex items-center gap-0.5 text-xs font-medium ${
              isUp ? 'text-emerald-500' : 'text-red-500'
            }`}
          >
            {isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      <p className="mt-4 text-2xl font-semibold tracking-tight text-ink">{formatValue(value, format, locale)}</p>
      <p className="mt-1 text-sm text-muted">{resolvedLabel}</p>
    </BentoCard>
  );
}
