import { useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EKTACard from '@/Components/Profil/EKTACard';
import SearchableSelect from '@/Components/SearchableSelect';
import { useLanguage } from '@/Contexts/LanguageContext';
import { Camera, Printer } from 'lucide-react';

function ProfilIndex({ user }) {
    const { t } = useLanguage();
    const { errors } = usePage().props;
    const isPetugas = user.role === 'petugas';

    const shiftOptions = [
        { value: '', label: t('profil.shift.notset') },
        { value: 'pagi', label: t('profil.shift.morning') },
        { value: 'siang', label: t('profil.shift.afternoon') },
        { value: 'malam', label: t('profil.shift.night') },
    ];

    const form = useForm({
        name: user.name || '',
        phone: user.phone || '',
        alamat: user.alamat || '',
        shift_kerja: user.shift_kerja || '',
    });

    const avatarForm = useForm({ avatar: null });

    const submit = (e) => {
        e.preventDefault();
        form.patch('/profil', { preserveScroll: true });
    };

    const gantiAvatar = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        avatarForm.setData('avatar', file);
        avatarForm.post('/profil/avatar', { preserveScroll: true, forceFormData: true });
    };

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-xl font-semibold text-ink">{isPetugas ? t('profil.petugas.title') : t('profil.anggota.title')}</h2>
                <p className="text-sm text-muted">{isPetugas ? t('profil.petugas.subtitle') : t('profil.anggota.subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
                <div className="space-y-4 rounded-2xl border border-border bg-surface p-5">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <img
                                src={user.avatar_url}
                                alt={user.name}
                                className="h-16 w-16 rounded-full object-cover ring-1 ring-border"
                            />
                            <label className="absolute -bottom-1 -right-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-accent text-white">
                                <Camera size={12} />
                                <input type="file" accept="image/*" onChange={gantiAvatar} className="hidden" />
                            </label>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-ink">{user.email}</p>
                            <p className="text-xs text-muted">{t('profil.changePhotoHint')}</p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-3">
                        <div>
                            <label className="text-xs font-medium uppercase tracking-wider text-muted">{t('profil.field.name')}</label>
                            <input
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                className="mt-1.5 w-full rounded-lg border border-border bg-base px-3 py-2 text-sm text-ink focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="text-xs font-medium uppercase tracking-wider text-muted">{t('profil.field.phone')}</label>
                            <input
                                value={form.data.phone}
                                onChange={(e) => form.setData('phone', e.target.value)}
                                className="mt-1.5 w-full rounded-lg border border-border bg-base px-3 py-2 text-sm text-ink focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium uppercase tracking-wider text-muted">{t('profil.field.address')}</label>
                            <textarea
                                value={form.data.alamat}
                                onChange={(e) => form.setData('alamat', e.target.value)}
                                rows={3}
                                className="mt-1.5 w-full resize-none rounded-lg border border-border bg-base px-3 py-2 text-sm text-ink focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
                            />
                        </div>

                        {isPetugas && (
                            <div>
                                <label className="text-xs font-medium uppercase tracking-wider text-muted">{t('profil.field.shift')}</label>
                                <div className="mt-1.5">
                                    <SearchableSelect
                                        value={form.data.shift_kerja}
                                        onChange={(val) => form.setData('shift_kerja', val)}
                                        options={shiftOptions}
                                        searchPlaceholder={t('common.search')}
                                        emptyText={t('common.noResults')}
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={form.processing}
                            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                        >
                            {form.processing ? t('profil.saving') : t('profil.save')}
                        </button>
                        {form.recentlySuccessful && <span className="ml-3 text-xs text-emerald-500">{t('profil.saved')}</span>}
                    </form>
                </div>

                <div className="space-y-3">
                    <EKTACard user={user} />
                    <button
                        onClick={() => window.print()}
                        className="mx-auto flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-ink hover:bg-surface2 print:hidden"
                    >
                        <Printer size={15} /> {t('profil.print')}
                    </button>
                </div>
            </div>
        </div>
    );
}

ProfilIndex.layout = (page) => <AuthenticatedLayout title="Profil Saya">{page}</AuthenticatedLayout>;

export default ProfilIndex;
