import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import BentoCard from '@/Components/BentoCard';
import { useLanguage } from '@/Contexts/LanguageContext';

export default function CirculationBarChart({ data }) {
  const { t } = useLanguage();

  return (
    <BentoCard>
      <p className="text-sm font-semibold text-ink">{t('dashboard.circulation.title')}</p>
      <p className="text-xs text-muted">{t('dashboard.circulation.subtitle')}</p>

      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" vertical={false} />
            <XAxis
              dataKey="hari"
              tick={{ fontSize: 12, fill: 'rgb(var(--text-secondary))' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: 'rgb(var(--text-secondary))' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: 'rgb(var(--surface))',
                border: '1px solid rgb(var(--border))',
                borderRadius: 10,
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="pinjam" name={t('dashboard.circulation.borrow')} fill="rgb(var(--accent-500))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="kembali" name={t('dashboard.circulation.return')} fill="rgb(161 161 170)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </BentoCard>
  );
}
