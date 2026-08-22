import { forwardRef } from 'react';

/**
 * Input dengan floating label ala SaaS modern (Stripe/Linear style).
 * Trik: placeholder=" " (spasi, bukan kosong) dikombinasikan dengan
 * variant Tailwind `peer-[&:not(:placeholder-shown)]` supaya label naik
 * begitu ada isi ATAU saat fokus.
 */
const FloatingInput = forwardRef(function FloatingInput(
  { id, label, type = 'text', value, onChange, error, icon: Icon, autoComplete, rightElement, ...props },
  ref
) {
  return (
    <div>
      <div className="relative">
        {Icon && (
          <Icon className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none peer-focus:text-accent" />
        )}
        <input
          ref={ref}
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder=" "
          className={`peer w-full rounded-xl bg-base border ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-500/30'
              : 'border-border focus:border-accent focus:ring-accent/30'
          } ${Icon ? 'pl-10' : 'pl-3.5'} ${rightElement ? 'pr-10' : 'pr-3.5'} pt-5 pb-2 text-sm text-ink placeholder-transparent shadow-sm focus:outline-none focus:ring-2 transition-all`}
          {...props}
        />
        <label
          htmlFor={id}
          className={`absolute ${Icon ? 'left-10' : 'left-3.5'} top-1/2 -translate-y-1/2 text-sm text-muted pointer-events-none transition-all
            peer-focus:top-3.5 peer-focus:text-[10px] peer-focus:font-medium peer-focus:text-accent
            peer-[&:not(:placeholder-shown)]:top-3.5 peer-[&:not(:placeholder-shown)]:text-[10px] peer-[&:not(:placeholder-shown)]:font-medium peer-[&:not(:placeholder-shown)]:text-muted`}
        >
          {label}
        </label>
        {rightElement && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
});

export default FloatingInput;
