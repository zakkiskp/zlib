import { Clock, CircleCheck, XCircle, PackageCheck, AlertTriangle } from 'lucide-react';
import BentoCard from '@/Components/BentoCard';
import { useLanguage } from '@/Contexts/LanguageContext';

const STATUS_META = {
  menunggu_persetujuan: { icon: Clock, color: 'text-amber-500' },
  disetujui: { icon: CircleCheck, color: 'text-accent' },
  ditolak: { icon: XCircle, color: 'text-red-500' },
  dipinjam: { icon: Clock, color: 'text-accent' },
  dikembalikan: { icon: PackageCheck, color: 'text-emerald-500' },
  terlambat: { icon: AlertTriangle, color: 'text-red-500' },
};

export default function ActivityFeed({ data }) {
  const { t } = useLanguage();

  return (
    <BentoCard>
      <p className="text-sm font-semibold text-ink">{t('dashboard.activity.title')}</p>
      <p className="text-xs text-muted">{t('dashboard.activity.subtitle')}</p>

      <div className="mt-4 space-y-4">
        {(!data || data.length === 0) && <p className="text-sm text-muted">{t('dashboard.activity.empty')}</p>}
        {data?.map((item) => {
          const meta = STATUS_META[item.status] ?? STATUS_META.dipinjam;
          const StatusIcon = meta.icon;
          return (
            <div key={item.id} className="flex items-center gap-3">
              {item.avatar ? (
                <img
                  src={item.avatar}
                  alt={item.nama}
                  className="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-border"
                />
              ) : (
                <div className="h-8 w-8 shrink-0 rounded-full bg-surface2" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-ink">
                  <span className="font-medium">{item.nama}</span>{' '}
                  <span className="text-muted">{t(`dashboard.activity.status.${item.status}`)}</span>{' '}
                  <span className="font-medium">&ldquo;{item.buku}&rdquo;</span>
                </p>
                <p className="text-xs text-muted">{item.waktu}</p>
              </div>
              <StatusIcon size={15} className={`shrink-0 ${meta.color}`} />
            </div>
          );
        })}
      </div>
    </BentoCard>
  );
}
