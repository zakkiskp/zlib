import { useState, useRef } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { resolveMediaUrl, inputClass } from '@/Utils/ui';
import { useLanguage } from '@/Contexts/LanguageContext';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import {
  User,
  Mail,
  Camera,
  KeyRound,
  Save,
  Settings2,
  Building2,
  Percent,
  CalendarClock,
  BookMarked,
  ImagePlus,
  Loader2,
  CheckCircle2,
  Languages,
} from 'lucide-react';

function Tabs({ active, onChange, t }) {
  const tabs = [
    { key: 'profil', label: t('profile.tab.profil'), icon: User },
    { key: 'sistem', label: t('profile.tab.sistem'), icon: Settings2 },
  ];

  return (
    <div className="relative inline-flex rounded-xl bg-surface2 p-1 border border-border/60">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`relative z-10 flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              isActive
                ? 'text-ink'
                : 'text-muted hover:text-ink'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="admin-profile-tab-pill"
                className="absolute inset-0 rounded-lg bg-surface shadow-sm border border-border/70 -z-10"
                transition={{ type: 'spring', bounce: 0.25, duration: 0.4 }}
              />
            )}
            <Icon className="w-4 h-4" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

function FieldShell({ label, icon: Icon, error, children }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-medium text-muted mb-1.5">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function SubmitButton({ processing, label, savingLabel }) {
  return (
    <button
      type="submit"
      disabled={processing}
      className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.25)] shadow-glow-accent hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
      {processing ? savingLabel : label}
    </button>
  );
}

function FlashBanner({ message }) {
  if (!message) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="mb-5 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400"
    >
      <CheckCircle2 className="w-4 h-4 shrink-0" />
      {message}
    </motion.div>
  );
}

function LanguageCard({ t }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-surface/70 backdrop-blur-md p-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h4 className="text-sm font-semibold text-ink flex items-center gap-2">
            <Languages className="w-4 h-4 text-accent" />
            {t('profile.language.title')}
          </h4>
          <p className="text-xs text-muted mt-1">{t('profile.language.desc')}</p>
        </div>
        <LanguageSwitcher />
      </div>
    </div>
  );
}

function ProfileTab({ profile, t }) {
  const avatarInputRef = useRef(null);
  /**
   * FIX BUG #2 (foto tersimpan di DB tapi preview tidak update):
   *
   * ROOT CAUSE: `avatarPreview` sebelumnya pakai useState(resolveMediaUrl(
   * profile.avatar_url)) — nilai awal itu CUMA dipakai sekali saat mount
   * pertama. Setelah submit sukses, Inertia me-render ulang komponen ini
   * dengan prop `profile.avatar_url` yang sudah baru (server sudah benar
   * simpan), TAPI React tidak otomatis re-run useState initializer pada
   * render berikutnya — jadi avatarPreview tetap nyangkut di nilai lama,
   * walau datanya di database sudah benar.
   *
   * FIX: pisahkan jadi 2 konsep —
   * 1. `pendingAvatarPreview` — blob URL LOKAL, HANYA terisi selagi user
   *    baru saja pilih file baru (belum tentu tersimpan).
   * 2. `displayedAvatar` — nilai yang benar-benar dirender, dihitung ULANG
   *    di setiap render: pakai preview lokal kalau ada, kalau tidak ada
   *    (termasuk setelah submit sukses & pendingAvatarPreview direset)
   *    otomatis fallback ke `profile.avatar_url` TERBARU dari server.
   */
  const [pendingAvatarPreview, setPendingAvatarPreview] = useState(null);
  const [avatarSaveError, setAvatarSaveError] = useState(null);
  const displayedAvatar = pendingAvatarPreview ?? resolveMediaUrl(profile.avatar_url);

  const profileForm = useForm({
    name: profile.name || '',
    email: profile.email || '',
    avatar: null,
  });

  const passwordForm = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarSaveError(null);
    profileForm.setData('avatar', file);
    setPendingAvatarPreview(URL.createObjectURL(file));
  }

  function submitProfile(e) {
    e.preventDefault();
    setAvatarSaveError(null);
    profileForm.transform((data) => ({ ...data, _method: 'put' }));
    profileForm.post(route('admin.profile.update'), {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        // Reset field file lokal DAN preview lokal — setelah ini
        // displayedAvatar otomatis fallback ke profile.avatar_url yang
        // baru datang segar dari server lewat kunjungan Inertia ini.
        profileForm.setData('avatar', null);
        setPendingAvatarPreview(null);
      },
      onError: (errors) => {
        // Supaya kegagalan tidak diam-diam — kalau ada masalah di luar
        // validasi field (mis. server error), setidaknya kelihatan di console.
        console.error('[Z-Lib] Gagal menyimpan profil:', errors);
        if (!errors.name && !errors.email && !errors.avatar) {
          setAvatarSaveError('Terjadi kesalahan saat menyimpan. Coba lagi atau cek console untuk detail.');
        }
      },
    });
  }

  function submitPassword(e) {
    e.preventDefault();
    passwordForm.put(route('admin.profile.password'), {
      preserveScroll: true,
      onSuccess: () => passwordForm.reset(),
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Avatar Card */}
      <div className="lg:col-span-1 rounded-2xl border border-border/70 bg-surface/70 backdrop-blur-md p-6 flex flex-col items-center text-center">
        <div className="relative group">
          <div className="w-28 h-28 rounded-2xl overflow-hidden ring-4 ring-surface2 shadow-lg bg-surface2 flex items-center justify-center">
            {displayedAvatar ? (
              <img src={displayedAvatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-muted" />
            )}
          </div>
          <button
            type="button"
            onClick={() => avatarInputRef.current?.click()}
            className="absolute -bottom-2 -right-2 flex items-center justify-center w-9 h-9 rounded-full bg-accent text-white shadow-glow-accent border-2 border-surface hover:brightness-110 transition-all"
          >
            <Camera className="w-4 h-4" />
          </button>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
        <h3 className="mt-4 font-semibold text-ink">{profile.name}</h3>
        <p className="text-xs text-muted">{profile.email}</p>
        <span className="mt-3 inline-flex items-center rounded-full bg-accent/10 text-accent text-[11px] font-semibold px-2.5 py-1">
          {t('profile.badge.admin')}
        </span>
        {profileForm.errors.avatar && (
          <p className="mt-2 text-xs text-red-500">{profileForm.errors.avatar}</p>
        )}
        {avatarSaveError && <p className="mt-2 text-xs text-red-500">{avatarSaveError}</p>}
      </div>

      {/* Forms */}
      <div className="lg:col-span-2 space-y-5">
        <form
          onSubmit={submitProfile}
          className="rounded-2xl border border-border/70 bg-surface/70 backdrop-blur-md p-6"
        >
          <h4 className="text-sm font-semibold text-ink mb-4">{t('profile.account.title')}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldShell label={t('profile.account.name')} icon={User} error={profileForm.errors.name}>
              <input
                type="text"
                className={inputClass}
                value={profileForm.data.name}
                onChange={(e) => profileForm.setData('name', e.target.value)}
              />
            </FieldShell>
            <FieldShell label={t('profile.account.email')} icon={Mail} error={profileForm.errors.email}>
              <input
                type="email"
                className={inputClass}
                placeholder="admin@gmail.com"
                value={profileForm.data.email}
                onChange={(e) => profileForm.setData('email', e.target.value)}
              />
            </FieldShell>
          </div>
          <div className="mt-5 flex justify-end">
            <SubmitButton processing={profileForm.processing} label={t('profile.save')} savingLabel={t('profile.saving')} />
          </div>
        </form>

        <form
          onSubmit={submitPassword}
          className="rounded-2xl border border-border/70 bg-surface/70 backdrop-blur-md p-6"
        >
          <h4 className="text-sm font-semibold text-ink mb-4 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-accent" />
            {t('profile.password.title')}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FieldShell label={t('profile.password.current')} error={passwordForm.errors.current_password}>
              <input
                type="password"
                className={inputClass}
                value={passwordForm.data.current_password}
                onChange={(e) => passwordForm.setData('current_password', e.target.value)}
              />
            </FieldShell>
            <FieldShell label={t('profile.password.new')} error={passwordForm.errors.password}>
              <input
                type="password"
                className={inputClass}
                value={passwordForm.data.password}
                onChange={(e) => passwordForm.setData('password', e.target.value)}
              />
            </FieldShell>
            <FieldShell label={t('profile.password.confirm')} error={passwordForm.errors.password_confirmation}>
              <input
                type="password"
                className={inputClass}
                value={passwordForm.data.password_confirmation}
                onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
              />
            </FieldShell>
          </div>
          <div className="mt-5 flex justify-end">
            <SubmitButton processing={passwordForm.processing} label={t('profile.password.save')} savingLabel={t('profile.saving')} />
          </div>
        </form>

        <LanguageCard t={t} />
      </div>
    </div>
  );
}

function SystemTab({ settings, t }) {
  const logoInputRef = useRef(null);
  // Pola sama dengan fix avatar di ProfileTab: preview lokal terpisah dari
  // sumber kebenaran (settings.site_logo), supaya otomatis sinkron setelah
  // submit sukses tanpa nyangkut di nilai lama.
  const [pendingLogoPreview, setPendingLogoPreview] = useState(null);
  const displayedLogo = pendingLogoPreview ?? resolveMediaUrl(settings.site_logo);

  const form = useForm({
    site_name: settings.site_name || 'Z-Lib',
    site_logo: null,
    denda_per_hari: settings.denda_per_hari ?? 1000,
    durasi_pinjam_maks: settings.durasi_pinjam_maks ?? 7,
    maks_buku_dipinjam: settings.maks_buku_dipinjam ?? 3,
  });

  function handleLogoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    form.setData('site_logo', file);
    setPendingLogoPreview(URL.createObjectURL(file));
  }

  function submit(e) {
    e.preventDefault();
    form.transform((data) => ({ ...data, _method: 'put' }));
    form.post(route('admin.settings.update'), {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        form.setData('site_logo', null);
        setPendingLogoPreview(null);
      },
    });
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Branding */}
      <div className="md:col-span-2 rounded-2xl border border-border/70 bg-surface/70 backdrop-blur-md p-6">
        <h4 className="text-sm font-semibold text-ink mb-4 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-accent" />
          {t('profile.system.identity')}
        </h4>
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface2 border border-border flex items-center justify-center">
              {displayedLogo ? (
                <img src={displayedLogo} alt="Logo" className="w-full h-full object-contain p-2" />
              ) : (
                <ImagePlus className="w-6 h-6 text-muted" />
              )}
            </div>
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="text-xs font-medium text-accent hover:underline"
            >
              {t('profile.system.logo')}
            </button>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoChange}
            />
          </div>
          <div className="flex-1 w-full">
            <FieldShell label={t('profile.system.sitename')} error={form.errors.site_name}>
              <input
                type="text"
                className={inputClass}
                value={form.data.site_name}
                onChange={(e) => form.setData('site_name', e.target.value)}
              />
            </FieldShell>
          </div>
        </div>
      </div>

      {/* Aturan Peminjaman */}
      <div className="rounded-2xl border border-border/70 bg-surface/70 backdrop-blur-md p-6">
        <h4 className="text-sm font-semibold text-ink mb-4 flex items-center gap-2">
          <Percent className="w-4 h-4 text-accent" />
          {t('profile.system.denda.title')}
        </h4>
        <FieldShell label={t('profile.system.denda.label')} error={form.errors.denda_per_hari}>
          <input
            type="number"
            min={0}
            className={inputClass}
            value={form.data.denda_per_hari}
            onChange={(e) => form.setData('denda_per_hari', e.target.value)}
          />
        </FieldShell>
      </div>

      <div className="rounded-2xl border border-border/70 bg-surface/70 backdrop-blur-md p-6 space-y-4">
        <h4 className="text-sm font-semibold text-ink flex items-center gap-2">
          <CalendarClock className="w-4 h-4 text-accent" />
          {t('profile.system.durasi.title')}
        </h4>
        <FieldShell label={t('profile.system.durasi.label')} error={form.errors.durasi_pinjam_maks}>
          <input
            type="number"
            min={1}
            className={inputClass}
            value={form.data.durasi_pinjam_maks}
            onChange={(e) => form.setData('durasi_pinjam_maks', e.target.value)}
          />
        </FieldShell>
        <FieldShell label={t('profile.system.maksbuku.label')} icon={BookMarked} error={form.errors.maks_buku_dipinjam}>
          <input
            type="number"
            min={1}
            className={inputClass}
            value={form.data.maks_buku_dipinjam}
            onChange={(e) => form.setData('maks_buku_dipinjam', e.target.value)}
          />
        </FieldShell>
      </div>

      <div className="md:col-span-2 flex justify-end">
        <SubmitButton processing={form.processing} label={t('profile.system.save')} savingLabel={t('profile.saving')} />
      </div>
    </form>
  );
}

export default function ProfileSettingsIndex({ profile, settings }) {
  const [activeTab, setActiveTab] = useState('profil');
  const { flash } = usePage().props;
  const { t } = useLanguage();

  return (
    <AuthenticatedLayout titleKey="profile.title">

      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-ink">{t('profile.title')}</h1>
            <p className="text-sm text-muted mt-0.5">{t('profile.subtitle')}</p>
          </div>
          <Tabs active={activeTab} onChange={setActiveTab} t={t} />
        </div>

        <AnimatePresence mode="wait">
          {flash?.success && <FlashBanner key="flash" message={flash.success} />}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'profil' ? (
              <ProfileTab profile={profile} t={t} />
            ) : (
              <SystemTab settings={settings} t={t} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </AuthenticatedLayout>
  );
}
