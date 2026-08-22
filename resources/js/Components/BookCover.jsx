import { useState } from 'react';
import { BookX } from 'lucide-react';

/**
 * Dipakai di semua tempat yang nampilin cover buku (grid, table, modal, dashboard).
 * - Skeleton pulse selama gambar masih loading (bukan blank putih tiba-tiba)
 * - Fade-in halus begitu gambar selesai dimuat
 * - Fallback ikon rapi kalau src kosong ATAU gambar gagal dimuat (404, dll)
 */
export default function BookCover({ src, alt, className = '' }) {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    return (
        <div className={`relative overflow-hidden bg-surface2 ${className}`}>
            {!loaded && !error && <div className="absolute inset-0 animate-pulse bg-surface2" />}

            {!src || error ? (
                <div className="flex h-full w-full items-center justify-center">
                    <BookX size={20} className="text-muted" />
                </div>
            ) : (
                <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                    onLoad={() => setLoaded(true)}
                    onError={() => setError(true)}
                    className={`h-full w-full object-cover transition-opacity duration-300 ${
                        loaded ? 'opacity-100' : 'opacity-0'
                    }`}
                />
            )}
        </div>
    );
}
