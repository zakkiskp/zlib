import { Head, Link, useForm } from '@inertiajs/react';
import AuthSplitLayout from '@/Layouts/AuthSplitLayout';
import { useLanguage } from '@/Contexts/LanguageContext';
import { MailCheck, Loader2, LogOut } from 'lucide-react';

export default function VerifyEmail({ status }) {
  const { t } = useLanguage();
  const form = useForm({});

  function submit(e) {
    e.preventDefault();
    form.post(route('verification.send'));
  }

  const justSent = status === 'verification-link-sent';

  return (
    <AuthSplitLayout title={t('authpages.verify.title')} description={t('authpages.verify.subtitle')}>
      <Head title={t('authpages.verify.title')} />

      <div className="rounded-2xl border border-border bg-surface p-5 flex gap-3">
        <MailCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
        <p className="text-sm text-muted">{t('authpages.verify.message')}</p>
      </div>

      {justSent && (
        <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-600 dark:text-emerald-400">
          {t('authpages.verify.resent')}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between gap-3">
        <form onSubmit={submit}>
          <button
            type="submit"
            disabled={form.processing}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.25)] shadow-glow-accent hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-60"
          >
            {form.processing && <Loader2 className="w-4 h-4 animate-spin" />}
            {t('authpages.verify.resend')}
          </button>
        </form>

        <Link
          href={route('logout')}
          method="post"
          as="button"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"
        >
          <LogOut className="w-3.5 h-3.5" />
          {t('authpages.verify.logout')}
        </Link>
      </div>
    </AuthSplitLayout>
  );
}
