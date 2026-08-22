import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import BentoCard from '@/Components/BentoCard';

export default function TrendAreaChart({ data }) {
    return (
        <BentoCard>
            <p className="text-sm font-semibold text-ink">Tren Peminjaman</p>
            <p className="text-xs text-muted">6 bulan terakhir</p>

            <div className="mt-4 h-56">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                        <defs>
                            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="rgb(var(--accent-500))" stopOpacity={0.35} />
                                <stop offset="100%" stopColor="rgb(var(--accent-500))" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" vertical={false} />
                        <XAxis
                            dataKey="bulan"
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
                            labelStyle={{ color: 'rgb(var(--text-primary))' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="total"
                            name="Peminjaman"
                            stroke="rgb(var(--accent-500))"
                            strokeWidth={2}
                            fill="url(#trendGradient)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </BentoCard>
    );
}
