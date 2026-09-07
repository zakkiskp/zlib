import StarRating from '@/Components/Katalog/StarRating';
import BookCover from '@/Components/BookCover';
import { useLanguage } from '@/Contexts/LanguageContext';

export default function BookTableRow({ buku, onClick }) {
    const { t } = useLanguage();
    const tersedia = buku.stok_tersedia > 0;

    return (
        <tr
            onClick={() => onClick(buku)}
            className="cursor-pointer border-b border-border/60 transition-colors last:border-0 hover:bg-surface2"
        >
            <td className="py-2.5 pl-1">
                <div className="flex items-center gap-3">
                    <BookCover src={buku.cover_url} alt={buku.judul_buku} className="h-12 w-9 shrink-0 rounded" />
                    <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink">{buku.judul_buku}</p>
                        <p className="truncate text-xs text-muted">{buku.penulis}</p>
                    </div>
                </div>
            </td>
            <td className="py-2.5 text-sm text-muted">
                {buku.kategoris?.map((k) => k.nama_kategori).join(', ') || '—'}
            </td>
            <td className="py-2.5">
                <StarRating rating={buku.rating_rata_rata} size={12} />
            </td>
            <td className="py-2.5 pr-1 text-right">
                <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        tersedia ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                    }`}
                >
                    {tersedia ? t('katalog.table.stockAvailable', { count: buku.stok_tersedia }) : t('katalog.badge.outofstock')}
                </span>
            </td>
        </tr>
    );
}
