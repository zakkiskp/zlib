import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Heart } from 'lucide-react';
import StarRating from '@/Components/Katalog/StarRating';
import BookCover from '@/Components/BookCover';

export default function BookGridCard({ buku, onClick }) {
    const tersedia = buku.stok_tersedia > 0;
    const [favorit, setFavorit] = useState(Boolean(buku.is_favorit));

    // PENTING: useState() cuma baca nilai awal SEKALI pas mount — gak
    // otomatis ngikutin kalau prop buku.is_favorit berubah belakangan
    // (misal habis navigasi pergi lalu balik lagi ke halaman ini dengan
    // data terbaru dari server). useEffect ini yang memastikan tampilan
    // selalu sinkron sama data asli.
    useEffect(() => {
        setFavorit(Boolean(buku.is_favorit));
    }, [buku.is_favorit]);

    const toggleFavorit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setFavorit((v) => !v);
        router.post(`/koleksi-pribadi/${buku.id}/toggle`, {}, { preserveScroll: true, preserveState: true });
    };

    return (
        <div onClick={() => onClick(buku)} className="group cursor-pointer text-left">
            <div className="relative transition-transform duration-200 group-hover:-translate-y-1">
                <BookCover
                    src={buku.cover_url}
                    alt={buku.judul_buku}
                    className="aspect-[3/4] rounded-xl shadow-soft group-hover:shadow-glow-accent"
                />
                <button
                    type="button"
                    onClick={toggleFavorit}
                    aria-label="Simpan ke koleksi"
                    className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-surface/90 backdrop-blur-md"
                >
                    <Heart size={14} className={favorit ? 'fill-red-500 text-red-500' : 'text-white drop-shadow'} />
                </button>
                <span
                    className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10.5px] font-medium backdrop-blur-md ${
                        tersedia ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'
                    }`}
                >
                    {tersedia ? 'Tersedia' : 'Habis'}
                </span>
            </div>
            <p className="mt-2 truncate text-sm font-medium text-ink">{buku.judul_buku}</p>
            <p className="truncate text-xs text-muted">{buku.penulis}</p>
            <div className="mt-1">
                <StarRating rating={buku.rating_rata_rata} size={12} />
            </div>
        </div>
    );
}
