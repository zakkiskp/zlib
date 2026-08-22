import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage } from '@inertiajs/react';
import AdminDashboard from '@/Components/Dashboard/AdminDashboard';
import PetugasDashboard from '@/Components/Dashboard/PetugasDashboard';
import AnggotaDashboard from '@/Components/Dashboard/AnggotaDashboard';

function Dashboard({ role, data }) {
    const { auth } = usePage().props;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-ink">
                    Halo, {auth?.user?.name?.split(' ')[0] || 'User'}
                </h2>
                <p className="text-sm text-muted">
                    {role === 'admin' && 'Ringkasan performa perpustakaan hari ini.'}
                    {role === 'petugas' && 'Antrean dan sirkulasi yang perlu kamu tangani.'}
                    {role === 'anggota' && 'Temukan buku favoritmu berikutnya.'}
                </p>
            </div>

            {role === 'admin' && <AdminDashboard data={data} />}
            {role === 'petugas' && <PetugasDashboard data={data} />}
            {role === 'anggota' && <AnggotaDashboard data={data} />}
        </div>
    );
}

Dashboard.layout = (page) => <AuthenticatedLayout title="Dashboard">{page}</AuthenticatedLayout>;

export default Dashboard;