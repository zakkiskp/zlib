import { BookMarked, Users, Clock, Banknote, Activity, ClipboardCheck, AlertTriangle, Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import BentoCard from '@/Components/BentoCard';

const ICONS = { BookMarked, Users, Clock, Banknote, Activity, ClipboardCheck, AlertTriangle, Wallet };

function formatValue(value, format) {
    if (format === 'rupiah') {
        return 'Rp' + new Intl.NumberFormat('id-ID').format(value);
    }
    return new Intl.NumberFormat('id-ID').format(value);
}

export default function StatCard({ label, value, icon, delta, format }) {
    const Icon = ICONS[icon] ?? Activity;
    const hasDelta = delta !== null && delta !== undefined;
    const isUp = hasDelta && delta >= 0;

    return (
        <BentoCard>
            <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Icon size={17} />
                </div>
                {hasDelta && (
                    <span
                        className={`flex items-center gap-0.5 text-xs font-medium ${
                            isUp ? 'text-emerald-500' : 'text-red-500'
                        }`}
                    >
                        {isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                        {Math.abs(delta)}%
                    </span>
                )}
            </div>
            <p className="mt-4 text-2xl font-semibold tracking-tight text-ink">{formatValue(value, format)}</p>
            <p className="mt-1 text-sm text-muted">{label}</p>
        </BentoCard>
    );
}
