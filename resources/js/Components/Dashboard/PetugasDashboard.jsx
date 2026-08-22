import StatCard from '@/Components/Dashboard/StatCard';
import ApprovalQueue from '@/Components/Dashboard/ApprovalQueue';
import CirculationBarChart from '@/Components/Dashboard/CirculationBarChart';

export default function PetugasDashboard({ data }) {
    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {data.stats.map((s) => (
                <StatCard key={s.label} {...s} />
            ))}

            <div className="lg:col-span-2">
                <ApprovalQueue data={data.antrean} />
            </div>
            <CirculationBarChart data={data.sirkulasiHarian} />
        </div>
    );
}
