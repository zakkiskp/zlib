import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthSplitLayout from '@/Layouts/AuthSplitLayout';
import FloatingInput from '@/Components/FloatingInput';
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function ConfirmPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm({ password: '' });

  function submit(e) {
    e.preventDefault();
    form.post(route('password.confirm'), {
      onFinish: () => form.reset('password'),
    });
  }

  return (
    <AuthSplitLayout
      title="Konfirmasi Password"
      description="Ini adalah area sensitif. Mohon konfirmasi password Anda sebelum melanjutkan."
    >
      <Head title="Konfirmasi Password" />

      <form onSubmit={submit} className="space-y-4">
        <FloatingInput
          id="password"
          type={showPassword ? 'text' : 'password'}
          label="Password"
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

        <button
          type="submit"
          disabled={form.processing}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-semibold text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.25)] shadow-glow-accent hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-60"
        >
          {form.processing && <Loader2 className="w-4 h-4 animate-spin" />}
          Konfirmasi
        </button>
      </form>
    </AuthSplitLayout>
  );
}
