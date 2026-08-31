import { QRCodeSVG } from 'qrcode.react';
import { Library } from 'lucide-react';
import { useLanguage } from '@/Contexts/LanguageContext';

export default function EKTACard({ user }) {
    const { t } = useLanguage();
    return (
        <div
            id="ekta-card"
            className="mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface to-surface2 p-5 shadow-glow-accent"
        >
            <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/15 text-accent">
                    <Library size={14} />
                </div>
                <span className="text-sm font-semibold text-ink">Zlib Digital Library</span>
            </div>
            <p className="mt-0.5 text-[10.5px] uppercase tracking-wider text-muted">{t('ekta.subtitle')}</p>

            <div className="mt-4 flex items-center gap-4">
                <img
                    src={user.avatar_url}
                    alt={user.name}
                    className="h-16 w-16 shrink-0 rounded-xl object-cover ring-2 ring-accent/30"
                />
                <div className="min-w-0">
                    <p className="truncate text-base font-semibold text-ink">{user.name}</p>
                    <p className="text-xs capitalize text-muted">{user.role}</p>
                    <p className="mt-1 font-mono text-xs text-muted">{user.no_anggota}</p>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl bg-base/60 p-3">
                <div className="text-[10.5px] text-muted">
                    <p>{t('ekta.validity')}</p>
                    <p className="mt-0.5 font-mono">@{user.username}</p>
                </div>
                <div className="rounded-lg bg-white p-1.5">
                    <QRCodeSVG value={user.no_anggota || user.username || 'zlib'} size={56} />
                </div>
            </div>
        </div>
    );
}
