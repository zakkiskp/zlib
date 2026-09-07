import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Katalog/Pagination';
import { CircleCheck, Clock3, Banknote, Megaphone, RefreshCw, Info } from 'lucide-react';
import { useLanguage } from '@/Contexts/LanguageContext';

const ICON_BY_TYPE = {
    jatuh_tempo: Clock3,
    approval: CircleCheck,
    denda: Banknote,
    pengumuman: Megaphone,
    perpanjangan: RefreshCw,
    info: Info,
};

function NotifikasiIndex({ notifikasi }) {
    const { t } = useLanguage();
    const tandai = (id) => {
        router.post(`/notifikasi/${id}/tandai`, {}, { preserveScroll: true, preserveState: true });
    };

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-xl font-semibold text-ink">{t('notifikasi.title')}</h2>
                <p className="text-sm text-muted">{t('notifikasi.subtitle')}</p>
            </div>

            {notifikasi.data.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-surface/50 p-12 text-center text-sm text-muted">
                    {t('notifikasi.empty')}
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-border bg-surface">
                    {notifikasi.data.map((n) => {
                        const Icon = ICON_BY_TYPE[n.tipe] ?? Info;
                        return (
                            <div
                                key={n.id}
                                onClick={() => !n.is_read && tandai(n.id)}
                                className={`flex gap-3 border-b border-border/60 p-4 last:border-0 ${
                                    !n.is_read ? 'cursor-pointer bg-accent/[0.04]' : ''
                                }`}
                            >
                                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface2 text-muted">
                                    <Icon size={16} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-ink">{n.judul}</p>
                                    <p className="mt-0.5 text-sm text-muted">{n.pesan}</p>
                                    <p className="mt-1 text-xs text-muted/70">
                                        {new Date(n.created_at).toLocaleString('id-ID')}
                                    </p>
                                </div>
                                {!n.is_read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />}
                            </div>
                        );
                    })}
                </div>
            )}
            <Pagination links={notifikasi.links} />
        </div>
    );
}

NotifikasiIndex.layout = (page) => <AuthenticatedLayout titleKey="notifikasi.title">{page}</AuthenticatedLayout>;

export default NotifikasiIndex;
