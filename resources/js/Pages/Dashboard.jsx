import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage } from '@inertiajs/react';
import { LayoutGrid, ClipboardList, Compass } from 'lucide-react';
import AdminDashboard from '@/Components/Dashboard/AdminDashboard';
import PetugasDashboard from '@/Components/Dashboard/PetugasDashboard';
import AnggotaDashboard from '@/Components/Dashboard/AnggotaDashboard';
import { useLanguage } from '@/Contexts/LanguageContext';

// TASK: revisi UI dashboard — ikon kecil per role di samping sapaan,
// supaya langsung kelihatan "mode" apa yang sedang aktif tanpa perlu
// baca teks dulu (clarity at a glance).
const ROLE_ICON = { admin: LayoutGrid, petugas: ClipboardList, anggota: Compass };
const SUBTITLE_KEY = {
  admin: 'dashboard.admin.subtitle',
  petugas: 'dashboard.petugas.subtitle',
  anggota: 'dashboard.anggota.subtitle',
};

function Dashboard({ role, data }) {
  const { auth } = usePage().props;
  const { t } = useLanguage();
  const Icon = ROLE_ICON[role] ?? LayoutGrid;
  const firstName = auth?.user?.name?.split(' ')[0] || 'User';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
          <Icon size={20} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-ink">{t('dashboard.greeting', { name: firstName })}</h2>
          <p className="text-sm text-muted">{t(SUBTITLE_KEY[role] ?? 'dashboard.anggota.subtitle')}</p>
        </div>
      </div>

      {role === 'admin' && <AdminDashboard data={data} />}
      {role === 'petugas' && <PetugasDashboard data={data} />}
      {role === 'anggota' && <AnggotaDashboard data={data} />}
    </div>
  );
}

Dashboard.layout = (page) => <AuthenticatedLayout title="Dashboard">{page}</AuthenticatedLayout>;

export default Dashboard;
