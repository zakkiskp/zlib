import StatCard from '@/Components/Dashboard/StatCard';
import ApprovalQueue from '@/Components/Dashboard/ApprovalQueue';
import CirculationBarChart from '@/Components/Dashboard/CirculationBarChart';
import SectionLabel from '@/Components/SectionLabel';
import { useLanguage } from '@/Contexts/LanguageContext';

export default function PetugasDashboard({ data }) {
  const { t } = useLanguage();

  return (
    <div className="space-y-5">
      <div>
        <SectionLabel>{t('dashboard.section.overview')}</SectionLabel>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {data.stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>{t('dashboard.section.operations')}</SectionLabel>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ApprovalQueue data={data.antrean} />
          </div>
          <CirculationBarChart data={data.sirkulasiHarian} />
        </div>
      </div>
    </div>
  );
}
