import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useLanguage } from '@/Contexts/LanguageContext';
import { dateInputClass } from '@/Utils/ui';
import {
  FileSpreadsheet,
  CalendarRange,
  FileText,
  FileDown,
  ClipboardList,
  Wallet,
  Clock3,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

function StatCard({ icon: Icon, label, value, accent = false }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-surface/70 backdrop-blur-md p-5">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent ? 'bg-accent/10 text-accent' : 'bg-surface2 text-muted'}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-muted">{label}</p>
          <p className="text-lg font-bold text-ink">{value}</p>
        </div>
      </div>
    </div>
  );
}

const STATUS_META = {
  dipinjam: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  dikembalikan: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  terlambat: 'bg-red-500/10 text-red-600 dark:text-red-400',
};

export default function ReportIndex({ transactions, filters, summary }) {
  const { t } = useLanguage();
  const [from, setFrom] = useState(filters.from);
  const [to, setTo] = useState(filters.to);

  function applyFilter() {
    router.get(route('admin.reports'), { from, to }, { preserveState: true, replace: true });
  }

  function exportUrl(type) {
    const base = type === 'pdf' ? route('admin.reports.pdf') : route('admin.reports.excel');
    const params = new URLSearchParams({ from, to }).toString();
    return `${base}?${params}`;
  }

  return (
    <AuthenticatedLayout>
      <Head title={t('report.title')} />

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
            <FileSpreadsheet className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-ink">{t('report.title')}</h1>
            <p className="text-sm text-muted">{t('report.subtitle')}</p>
          </div>
        </div>

        {/* Filter & Export Bar */}
        <div className="rounded-2xl border border-border/70 bg-surface/70 backdrop-blur-md p-4 flex flex-col md:flex-row md:items-center gap-3 justify-between mb-5">
          <div className="flex items-center gap-2">
            <CalendarRange className="w-4 h-4 text-muted shrink-0" />
            <input type="date" className={dateInputClass} value={from} onChange={(e) => setFrom(e.target.value)} />
            <span className="text-muted text-sm">—</span>
            <input type="date" className={dateInputClass} value={to} onChange={(e) => setTo(e.target.value)} />
            <button
              onClick={applyFilter}
              className="px-3.5 py-2 text-sm font-medium rounded-lg bg-ink text-base hover:opacity-90 transition-opacity"
            >
              {t('report.apply')}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={exportUrl('pdf')}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3.5 py-2 text-sm font-medium text-ink hover:bg-surface2 transition-colors"
            >
              <FileText className="w-4 h-4" />
              {t('report.exportPdf')}
            </a>
            <a
              href={exportUrl('excel')}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-3.5 py-2 text-sm font-semibold text-white shadow-glow-accent hover:brightness-110 transition-all"
            >
              <FileDown className="w-4 h-4" />
              {t('report.exportExcel')}
            </a>
          </div>
        </div>

        {/* Bento Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <StatCard icon={ClipboardList} label={t('report.stat.total')} value={summary.total_transaksi} accent />
          <StatCard icon={Wallet} label={t('report.stat.totalFine')} value={`Rp ${Number(summary.total_denda).toLocaleString('id-ID')}`} />
          <StatCard icon={Clock3} label={t('report.stat.notReturned')} value={summary.belum_kembali} />
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-border/70 bg-surface/70 backdrop-blur-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/70 text-left text-xs text-muted">
                  <th className="px-5 py-3 font-medium">{t('report.table.member')}</th>
                  <th className="px-5 py-3 font-medium">{t('report.table.book')}</th>
                  <th className="px-5 py-3 font-medium">{t('report.table.borrowDate')}</th>
                  <th className="px-5 py-3 font-medium">{t('report.table.dueDate')}</th>
                  <th className="px-5 py-3 font-medium">{t('report.table.returnDate')}</th>
                  <th className="px-5 py-3 font-medium">{t('report.table.status')}</th>
                  <th className="px-5 py-3 font-medium text-right">{t('report.table.fine')}</th>
                </tr>
              </thead>
              <tbody>
                {transactions.data.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-muted text-sm">
                      {t('report.empty')}
                    </td>
                  </tr>
                )}
                {transactions.data.map((trx, idx) => (
                  <motion.tr
                    key={trx.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(idx * 0.02, 0.3) }}
                    className="border-b border-border/50 hover:bg-surface2 transition-colors"
                  >
                    <td className="px-5 py-3 text-ink">{trx.anggota?.name || '-'}</td>
                    <td className="px-5 py-3 text-muted">{trx.buku?.judul_buku || '-'}</td>
                    <td className="px-5 py-3 text-muted text-xs">{trx.tanggal_pinjam}</td>
                    <td className="px-5 py-3 text-muted text-xs">{trx.tanggal_jatuh_tempo}</td>
                    <td className="px-5 py-3 text-muted text-xs">{trx.tanggal_kembali || '-'}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${STATUS_META[trx.status] || 'bg-surface2 text-muted'}`}>
                        {trx.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-ink font-medium">
                      Rp {Number(trx.denda || 0).toLocaleString('id-ID')}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {transactions.data.length > 0 && (
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-border/70 text-xs text-muted">
              <span>{t('report.pagination', { from: transactions.from, to: transactions.to, total: transactions.total })}</span>
              <div className="flex items-center gap-1">
                <button
                  disabled={!transactions.prev_page_url}
                  onClick={() => router.get(transactions.prev_page_url, {}, { preserveState: true })}
                  className="p-1.5 rounded-md border border-border disabled:opacity-40 hover:bg-surface2 transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  disabled={!transactions.next_page_url}
                  onClick={() => router.get(transactions.next_page_url, {}, { preserveState: true })}
                  className="p-1.5 rounded-md border border-border disabled:opacity-40 hover:bg-surface2 transition-colors"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
