import { Languages } from 'lucide-react';
import { useLanguage } from '@/Contexts/LanguageContext';

/**
 * Toggle bahasa ID/EN. Taruh di Topbar (global, selalu kelihatan) dan/atau
 * di halaman Profil (seperti dicontohkan di Admin/Profile/Index.jsx).
 */
export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="inline-flex items-center gap-1 rounded-lg bg-surface2 p-1 border border-border/60">
      <Languages className="w-3.5 h-3.5 text-muted ml-1.5 mr-0.5" />
      {['id', 'en'].map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
            lang === code
              ? 'bg-surface text-ink shadow-sm'
              : 'text-muted hover:text-ink'
          }`}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
