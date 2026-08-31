import { Head, useForm } from '@inertiajs/react';
import AuthSplitLayout from '@/Layouts/AuthSplitLayout';
import FloatingInput from '@/Components/FloatingInput';
import { useLanguage } from '@/Contexts/LanguageContext';
import { Mail, Loader2 } from 'lucide-react';

export default function ForgotPassword({ status }) {
  const { t } = useLanguage();
  const form = useForm({ email: '' });

  function submit(e) {
    e.preventDefault();
    form.post(route('password.email'));
  }

  return (
    <AuthSplitLayout title={t('authpages.forgot.title')} description={t('authpages.forgot.subtitle')}>
      <Head title={t('authpages.forgot.title')} />

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

        <button
          type="submit"
          disabled={form.processing}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-semibold text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.25)] shadow-glow-accent hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-60"
        >
          {form.processing && <Loader2 className="w-4 h-4 animate-spin" />}
          {t('authpages.forgot.submit')}
        </button>
      </form>
    </AuthSplitLayout>
  );
}
