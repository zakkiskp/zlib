import { Link } from '@inertiajs/react';
import { Clock } from 'lucide-react';
import BentoCard from '@/Components/BentoCard';
import BookCover from '@/Components/BookCover';

export default function ApprovalQueue({ data }) {
    return (
        <BentoCard>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold text-ink">Antrean Approval</p>
                    <p className="text-xs text-muted">Menunggu persetujuan peminjaman</p>
                </div>
                <Link href="/circulation-desk" prefetch className="text-xs font-medium text-accent hover:underline">
                    Buka Circulation Desk
                </Link>
            </div>

            <div className="mt-4 space-y-3">
                {(!data || data.length === 0) && (
                    <p className="py-6 text-center text-sm text-muted">Tidak ada antrean saat ini 🎉</p>
                )}
                {data?.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 rounded-xl border border-border/60 p-3">
                        <BookCover src={item.cover} alt={item.buku} className="h-12 w-9 shrink-0 rounded" />
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-ink">{item.buku}</p>
                            <p className="truncate text-xs text-muted">
                                {item.nama} · {item.waktu}
                            </p>
                        </div>
                        <Clock size={15} className="shrink-0 text-amber-500" />
                    </div>
                ))}
            </div>
        </BentoCard>
    );
}
