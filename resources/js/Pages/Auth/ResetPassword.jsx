import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthSplitLayout from '@/Layouts/AuthSplitLayout';
import FloatingInput from '@/Components/FloatingInput';
import { useLanguage } from '@/Contexts/LanguageContext';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function ResetPassword({ token, email }) {
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm({
    token,
    email: email || '',
    password: '',
    password_confirmation: '',
  });

  function submit(e) {
    e.preventDefault();
    form.post(route('password.store'), {
      onFinish: () => form.reset('password', 'password_confirmation'),
    });
  }

  return (
    <AuthSplitLayout title={t('authpages.reset.title')} description={t('authpages.reset.subtitle')}>
      <Head title={t('authpages.reset.title')} />

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
          label={t('authpages.reset.newpassword')}
          icon={Lock}
          autoComplete="new-password"
          value={form.data.password}
          onChange={(e) => form.setData('password', e.target.value)}
          error={form.errors.password}
          rightElement={
            <button type="button" onClick={() => setShowPassword((s) => !s)} className="text-muted hover:text-ink">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
        />
        <FloatingInput
          id="password_confirmation"
          type={showConfirm ? 'text' : 'password'}
          label={t('profile.password.confirm')}
          icon={Lock}
          autoComplete="new-password"
          value={form.data.password_confirmation}
          onChange={(e) => form.setData('password_confirmation', e.target.value)}
          error={form.errors.password_confirmation}
          rightElement={
            <button type="button" onClick={() => setShowConfirm((s) => !s)} className="text-muted hover:text-ink">
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
        />

        <button
          type="submit"
          disabled={form.processing}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-semibold text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.25)] shadow-glow-accent hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-60"
        >
          {form.processing && <Loader2 className="w-4 h-4 animate-spin" />}
          {t('authpages.reset.submit')}
        </button>
      </form>
    </AuthSplitLayout>
  );
}
