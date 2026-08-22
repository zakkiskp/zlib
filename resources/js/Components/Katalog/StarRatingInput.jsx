import { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRatingInput({ value, onChange, size = 22 }) {
    const [hover, setHover] = useState(0);

    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => {
                const n = i + 1;
                const active = hover ? n <= hover : n <= value;
                return (
                    <button
                        key={n}
                        type="button"
                        onMouseEnter={() => setHover(n)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => onChange(n)}
                        className="transition-transform hover:scale-110"
                    >
                        <Star size={size} className={active ? 'fill-amber-400 text-amber-400' : 'text-border'} />
                    </button>
                );
            })}
        </div>
    );
}
