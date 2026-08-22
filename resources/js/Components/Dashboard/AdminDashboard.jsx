import StatCard from '@/Components/Dashboard/StatCard';
import TrendAreaChart from '@/Components/Dashboard/TrendAreaChart';
import CategoryDonutChart from '@/Components/Dashboard/CategoryDonutChart';
import ActivityFeed from '@/Components/Dashboard/ActivityFeed';

export default function AdminDashboard({ data }) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {data.stats.map((s) => (
                <StatCard key={s.label} {...s} />
            ))}

            <div className="sm:col-span-2 xl:col-span-3">
                <TrendAreaChart data={data.trend} />
            </div>
            <div className="sm:col-span-2 xl:col-span-1">
                <CategoryDonutChart data={data.kategoriPopuler} />
            </div>

            <div className="sm:col-span-2 xl:col-span-4">
                <ActivityFeed data={data.aktivitas} />
            </div>
        </div>
    );
}
