export default function BentoCard({ children, className = '', hover = true, as: Tag = 'div', ...props }) {
    return (
        <Tag
            className={`rounded-2xl border border-border bg-surface p-5 transition-all duration-200 ${
                hover
                    ? 'hover:-translate-y-0.5 hover:scale-[1.01] hover:border-accent/30 hover:shadow-glow-accent'
                    : ''
            } ${className}`}
            {...props}
        >
            {children}
        </Tag>
    );
}
