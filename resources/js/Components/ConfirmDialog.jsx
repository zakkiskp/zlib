import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/Contexts/LanguageContext';

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, danger = true }) {
    const { t } = useLanguage();
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div onClick={onCancel} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div className="relative w-full max-w-sm rounded-2xl border border-border bg-surface p-5 shadow-soft">
                <div className="flex items-start gap-3">
                    <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                            danger ? 'bg-red-500/10 text-red-500' : 'bg-accent/10 text-accent'
                        }`}
                    >
                        <AlertTriangle size={18} />
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5">
                        <p className="text-sm font-semibold text-ink">{title}</p>
                        <p className="mt-1 text-sm text-muted">{message}</p>
                    </div>
                </div>
                <div className="mt-5 flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-ink hover:bg-surface2"
                    >
                        {t('common.cancel')}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-transform hover:-translate-y-0.5 ${
                            danger ? 'bg-red-500 hover:bg-red-600' : 'bg-accent'
                        }`}
                    >
                        {t('common.confirmContinue')}
                    </button>
                </div>
            </div>
        </div>
    );
}
