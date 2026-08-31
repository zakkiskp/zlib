import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import BentoCard from '@/Components/BentoCard';
import { useLanguage } from '@/Contexts/LanguageContext';

const PALETTE = [
  'rgb(var(--accent-500))',
  'rgb(var(--accent-600))',
  'rgb(161 161 170)',
  'rgb(113 113 122)',
  'rgb(82 82 91)',
];

export default function CategoryDonutChart({ data }) {
  const { t } = useLanguage();
  const isEmpty = !data || data.length === 0;

  return (
    <BentoCard>
      <p className="text-sm font-semibold text-ink">{t('dashboard.category.title')}</p>
      <p className="text-xs text-muted">{t('dashboard.category.subtitle')}</p>

      {isEmpty ? (
        <div className="flex h-48 items-center justify-center text-center text-sm text-muted">
          {t('dashboard.category.empty')}
        </div>
      ) : (
        <div className="mt-2 flex items-center gap-4">
          <div className="h-40 w-40 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="total"
                  nameKey="nama"
                  innerRadius={45}
                  outerRadius={68}
                  paddingAngle={3}
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={PALETTE[i % PALETTE.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'rgb(var(--surface))',
                    border: '1px solid rgb(var(--border))',
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            {data.map((d, i) => (
              <div key={d.nama} className="flex items-center gap-2 text-xs">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
                />
                <span className="flex-1 truncate text-muted">{d.nama}</span>
                <span className="font-medium text-ink">{d.total}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </BentoCard>
  );
}
