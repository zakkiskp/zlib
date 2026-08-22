import { Search } from 'lucide-react';
import NotificationBell from '@/Components/Navigation/NotificationBell';
import ThemeSwitcher from '@/Components/Navigation/ThemeSwitcher';
import UserMenu from '@/Components/Navigation/UserMenu';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { useLanguage } from '@/Contexts/LanguageContext';

export default function Topbar({ title }) {
    const { t } = useLanguage();

    return (
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-surface/70 px-4 backdrop-blur-md lg:px-6">
            <div className="flex min-w-0 flex-1 items-center gap-3">
                {title && <h1 className="truncate text-[15px] font-semibold text-ink lg:hidden">{title}</h1>}

                {/* Search — visual dulu, belum terhubung ke endpoint pencarian */}
                <div className="relative hidden max-w-sm flex-1 lg:block">
                    <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                        type="text"
                        placeholder={t('nav.search.placeholder')}
                        className="w-full rounded-lg border border-border bg-base/60 py-2 pl-9 pr-12 text-sm text-ink placeholder:text-muted focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
                    />
                    <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-border px-1.5 py-0.5 text-[10.5px] font-medium text-muted">
                        ⌘K
                    </kbd>
                </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
                <NotificationBell />
                <ThemeSwitcher />
                {/*
                  FITUR #5 — LanguageSwitcher dipasang di sini (bukan cuma di
                  halaman Profil Admin) supaya toggle ID/EN bisa diakses dari
                  Topbar yang sama untuk SEMUA role (admin, petugas, anggota),
                  karena Topbar ini dipakai bersama lewat AuthenticatedLayout.
                */}
                <LanguageSwitcher />
                <div className="mx-1 h-6 w-px bg-border" />
                <UserMenu />
            </div>
        </header>
    );
}
