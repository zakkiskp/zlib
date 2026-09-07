import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthSplitLayout from '@/Layouts/AuthSplitLayout';
import FloatingInput from '@/Components/FloatingInput';
import { useLanguage } from '@/Contexts/LanguageContext';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useLanguage();
  const form = useForm({ email: '', password: '', remember: false });

  function submit(e) {
    e.preventDefault();
    form.post(route('login'), { onFinish: () => form.reset('password') });
  }

  return (
    <AuthSplitLayout title={t('auth.login.title')} description={t('auth.login.subtitle')}>
      <Head title={t('authpages.login.title')} />

      {status && (
        <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-600 dark:text-emerald-400">
          {status}
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        <FloatingInput
          id="email"
          type="email"
          label={t('auth.login.email')}
          icon={Mail}
          autoComplete="username"
          value={form.data.email}
          onChange={(e) => form.setData('email', e.target.value)}
          error={form.errors.email}
        />
        <FloatingInput
          id="password"
          type={showPassword ? 'text' : 'password'}
          label={t('auth.login.password')}
          icon={Lock}
          autoComplete="current-password"
          value={form.data.password}
          onChange={(e) => form.setData('password', e.target.value)}
          error={form.errors.password}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="text-muted hover:text-ink"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-muted cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.data.remember}
              onChange={(e) => form.setData('remember', e.target.checked)}
              className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
            />
            {t('auth.login.remember')}
          </label>
          {canResetPassword && (
            <Link href={route('password.request')} className="text-accent hover:underline font-medium">
              {t('auth.login.forgot')}
            </Link>
          )}
        </div>

        {/*
          FIX kontras tombol "Masuk": bg-accent -> bg-accent
          (fallback kalau CSS var belum ke-set) + text-shadow tipis supaya
          teks putih tetap terbaca meski preset aksen user kebetulan warna
          terang (mis. Amber).
        */}
        <button
          type="submit"
          disabled={form.processing}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-semibold text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.25)] shadow-glow-accent hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-60"
        >
          {form.processing && <Loader2 className="w-4 h-4 animate-spin" />}
          {t('auth.login.submit')}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted">
        {t('auth.login.noaccount')}{' '}
        <Link href={route('register')} className="font-semibold text-accent hover:underline">
          {t('auth.login.register')}
        </Link>
      </p>
    </AuthSplitLayout>
  );
}
