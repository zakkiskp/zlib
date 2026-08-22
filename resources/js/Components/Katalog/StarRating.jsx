import { Star, StarHalf } from 'lucide-react';

export default function StarRating({ rating = 0, size = 14, showValue = true }) {
    const rounded = Math.round(rating * 2) / 2;
    const full = Math.floor(rounded);
    const half = rounded - full === 0.5;

    return (
        <div className="flex items-center gap-1">
            <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => {
                    if (i < full) {
                        return <Star key={i} size={size} className="fill-amber-400 text-amber-400" />;
                    }
                    if (i === full && half) {
                        return <StarHalf key={i} size={size} className="fill-amber-400 text-amber-400" />;
                    }
                    return <Star key={i} size={size} className="text-border" />;
                })}
            </div>
            {showValue && <span className="text-xs font-medium text-muted">{Number(rating).toFixed(1)}</span>}
        </div>
    );
}
