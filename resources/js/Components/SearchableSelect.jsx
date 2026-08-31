import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Search, Check } from 'lucide-react';

/**
 * STANDAR DROPDOWN Z-LIB — pengganti <select> HTML bawaan di seluruh
 * aplikasi (semua role: Admin, Petugas, Anggota).
 *
 * v2 — FIX BUG "TENGGELAM" (dropdown ketutup tabel/elemen di bawahnya):
 * ROOT CAUSE: sebelumnya panel dropdown di-render sebagai child langsung
 * (position: absolute) di dalam kartu filter. Kartu filter & kartu tabel
 * sama-sama pakai `backdrop-blur-md`, yang di CSS otomatis membuat
 * stacking context baru. Karena keduanya sibling, kartu yang urutannya
 * lebih belakang di DOM (tabel) SELALU digambar di atas kartu sebelumnya
 * (filter) walau dropdown-nya sendiri sudah dikasih z-50 — z-index itu
 * cuma berlaku di DALAM stacking context kartu filter, tidak bisa
 * "menembus" ke atas stacking context kartu tabel.
 *
 * FIX: render panel dropdown lewat React Portal langsung ke <body>,
 * posisinya dihitung manual dari getBoundingClientRect() tombol trigger.
 * Dengan begitu panel benar-benar lepas dari SEMUA overflow/stacking
 * context leluhurnya — tidak mungkin ketutup elemen apa pun lagi.
 *
 * Cara pakai (TIDAK BERUBAH dari v1, drop-in replacement):
 *   <SearchableSelect
 *     value={form.data.kategori_id}
 *     onChange={(val) => form.setData('kategori_id', val)}
 *     options={kategoriList.map(k => ({ value: k.id, label: k.nama }))}
 *     placeholder="Pilih kategori..."
 *     searchPlaceholder="Cari kategori..."
 *   />
 */
export default function SearchableSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Pilih...',
  searchPlaceholder = 'Cari...',
  emptyText = 'Tidak ada hasil',
  className = '',
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const searchInputRef = useRef(null);

  const selectedOption = options.find((o) => String(o.value) === String(value));

  const filtered = useMemo(() => {
    if (!query.trim()) return options;
    const q = query.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpward = spaceBelow < 260 && rect.top > 260;

    setCoords({
      top: openUpward ? rect.top - 6 : rect.bottom + 6,
      left: rect.left,
      width: rect.width,
      openUpward,
    });
  }, []);

  function openDropdown() {
    if (disabled) return;
    updatePosition();
    setOpen(true);
  }

  // Klik di luar TRIGGER *dan* di luar PANEL (yang sekarang ada di body,
  // bukan child dari trigger lagi) -> tutup dropdown.
  useEffect(() => {
    function handleClickOutside(e) {
      const clickedTrigger = triggerRef.current && triggerRef.current.contains(e.target);
      const clickedPanel = panelRef.current && panelRef.current.contains(e.target);
      if (!clickedTrigger && !clickedPanel) {
        setOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reposisi terus selama dropdown terbuka (scroll tabel, resize window, dst)
  useEffect(() => {
    if (!open) return;
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    const timer = setTimeout(() => searchInputRef.current?.focus(), 10);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
      clearTimeout(timer);
    };
  }, [open, updatePosition]);

  function selectOption(opt) {
    onChange(opt.value);
    setOpen(false);
    setQuery('');
  }

  function handleSearchKeyDown(e) {
    if (e.key === 'Escape') {
      setOpen(false);
      setQuery('');
    }
    if (e.key === 'Enter' && filtered.length === 1) {
      selectOption(filtered[0]);
    }
  }

  return (
    <div className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openDropdown())}
        className="w-full flex items-center justify-between gap-2 rounded-lg bg-base border border-border px-3.5 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className={`truncate ${selectedOption ? 'text-ink' : 'text-muted'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-muted shrink-0 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open &&
        createPortal(
          <AnimatePresence>
            <motion.div
              ref={panelRef}
              initial={{ opacity: 0, y: coords.openUpward ? 6 : -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: coords.openUpward ? 6 : -6, scale: 0.98 }}
              transition={{ duration: 0.14, ease: 'easeOut' }}
              style={{
                position: 'fixed',
                top: coords.openUpward ? undefined : coords.top,
                bottom: coords.openUpward ? window.innerHeight - coords.top : undefined,
                left: coords.left,
                width: Math.max(coords.width, 180),
              }}
              // z-[9999] + portal ke <body> -> TIDAK MUNGKIN lagi ketutup
              // tabel/kartu apa pun, karena sudah lepas dari stacking
              // context & overflow leluhurnya sama sekali.
              className="z-[9999] rounded-xl border border-border bg-surface shadow-soft overflow-hidden"
            >
              <div className="relative border-b border-border p-2">
                <Search className="w-3.5 h-3.5 text-muted absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder={searchPlaceholder}
                  className="w-full rounded-lg bg-base border-0 pl-8 pr-3 py-1.5 text-sm text-ink placeholder-muted focus:outline-none focus:ring-1 focus:ring-accent/40"
                />
              </div>
              <div className="max-h-56 overflow-y-auto py-1">
                {filtered.length === 0 && (
                  <p className="px-3.5 py-3 text-sm text-muted text-center">{emptyText}</p>
                )}
                {filtered.map((opt) => {
                  const isSelected = String(opt.value) === String(value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => selectOption(opt)}
                      className={`w-full flex items-center justify-between gap-2 px-3.5 py-2 text-sm text-left transition-colors ${
                        isSelected ? 'bg-accent/10 text-accent font-medium' : 'text-ink hover:bg-surface2'
                      }`}
                    >
                      <span className="truncate">{opt.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
