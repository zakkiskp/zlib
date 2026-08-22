import { Link } from '@inertiajs/react';
import { Star } from 'lucide-react';
import BentoCard from '@/Components/BentoCard';
import BookCover from '@/Components/BookCover';

export default function PopularBooksGrid({ data }) {
    return (
        <BentoCard hover={false}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold text-ink">Rekomendasi Untukmu</p>
                    <p className="text-xs text-muted">Buku dengan rating tertinggi</p>
                </div>
                <Link href="/katalog" prefetch className="text-xs font-medium text-accent hover:underline">
                    Lihat Katalog
                </Link>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {data?.map((buku) => (
                    <Link
                        key={buku.id}
                        href="/katalog"
                        prefetch
                        className="group rounded-lg transition-transform duration-200 hover:-translate-y-0.5"
                    >
                        <BookCover src={buku.cover_url} alt={buku.judul_buku} className="aspect-[3/4] rounded-lg shadow-soft" />
                        <p className="mt-2 truncate text-xs font-medium text-ink">{buku.judul_buku}</p>
                        <div className="flex items-center gap-1 text-[11px] text-muted">
                            <Star size={11} className="fill-amber-400 text-amber-400" />
                            {Number(buku.rating_rata_rata).toFixed(1)}
                        </div>
                    </Link>
                ))}
            </div>
        </BentoCard>
    );
}
