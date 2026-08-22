import { Link } from '@inertiajs/react';
import StatCard from '@/Components/Dashboard/StatCard';
import AnnouncementBanner from '@/Components/Dashboard/AnnouncementBanner';
import PopularBooksGrid from '@/Components/Dashboard/PopularBooksGrid';

export default function AnggotaDashboard({ data }) {
    return (
        <div className="space-y-4">
            <AnnouncementBanner data={data.pengumuman} />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {data.stats.map((s) => (
                    <StatCard key={s.label} {...s} />
                ))}
            </div>

            {data.kategori?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {data.kategori.map((k) => (
                        <Link
                            key={k.id}
                            href="/katalog"
                            className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-muted hover:border-accent/40 hover:text-accent"
                        >
                            {k.nama_kategori}
                        </Link>
                    ))}
                </div>
            )}

            <PopularBooksGrid data={data.rekomendasi} />
        </div>
    );
}
