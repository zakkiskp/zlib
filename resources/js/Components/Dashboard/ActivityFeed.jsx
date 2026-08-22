import { Clock, CircleCheck, XCircle, PackageCheck, AlertTriangle } from 'lucide-react';
import BentoCard from '@/Components/BentoCard';

const STATUS_META = {
    menunggu_persetujuan: { label: 'mengajukan pinjam', icon: Clock, color: 'text-amber-500' },
    disetujui: { label: 'disetujui peminjamannya', icon: CircleCheck, color: 'text-accent' },
    ditolak: { label: 'ditolak pengajuannya', icon: XCircle, color: 'text-red-500' },
    dipinjam: { label: 'sedang meminjam', icon: Clock, color: 'text-accent' },
    dikembalikan: { label: 'mengembalikan', icon: PackageCheck, color: 'text-emerald-500' },
    terlambat: { label: 'terlambat mengembalikan', icon: AlertTriangle, color: 'text-red-500' },
};

export default function ActivityFeed({ data }) {
    return (
        <BentoCard>
            <p className="text-sm font-semibold text-ink">Aktivitas Terbaru</p>
            <p className="text-xs text-muted">Sirkulasi peminjaman real-time</p>

            <div className="mt-4 space-y-4">
                {(!data || data.length === 0) && <p className="text-sm text-muted">Belum ada aktivitas.</p>}
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
                                    <span className="text-muted">{meta.label}</span>{' '}
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
