import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="flex flex-wrap items-center justify-center gap-1.5">
            {links.map((link, i) =>
                link.url ? (
                    <Link
                        key={i}
                        href={link.url}
                        preserveScroll
                        prefetch
                        className={`min-w-[32px] rounded-lg px-2.5 py-1.5 text-center text-xs font-medium transition-colors ${
                            link.active ? 'bg-accent text-white' : 'text-muted hover:bg-surface2 hover:text-ink'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <span
                        key={i}
                        className="min-w-[32px] cursor-not-allowed rounded-lg px-2.5 py-1.5 text-center text-xs font-medium text-muted/40"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ),
            )}
        </div>
    );
}
