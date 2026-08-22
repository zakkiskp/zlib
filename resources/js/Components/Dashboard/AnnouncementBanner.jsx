import { Megaphone } from 'lucide-react';

export default function AnnouncementBanner({ data }) {
    if (!data) return null;

    return (
        <div className="relative overflow-hidden rounded-2xl border border-accent/20 bg-accent/[0.06] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.01] hover:border-accent/40 hover:shadow-glow-accent">
            <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
                    <Megaphone size={17} />
                </div>
                <div>
                    <p className="text-sm font-semibold text-ink">{data.judul}</p>
                    <p className="mt-1 text-sm text-muted">{data.konten}</p>
                </div>
            </div>
        </div>
    );
}
