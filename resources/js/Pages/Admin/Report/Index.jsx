import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
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

/**
 * CATATAN: Halaman ini memakai `trx.anggota` (bukan `trx.user`) mengikuti
 * penyesuaian relasi yang sudah Anda lakukan di model Peminjaman.php &
 * ReportController.php. Kalau Anda masih punya customization lain di file
 * asli Anda, cek ulang sebelum menimpa — file ini hanya menambal bug
 * styling input tanggal, bagian lain direkonstruksi dari versi awal.
 */

function StatCard({ icon: Icon, label, value, accent = false }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-surface/70 backdrop-blur-md p-5">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            accent ? 'bg-accent/10 text-accent' : 'bg-surface2 text-muted'
          }`}
        >
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
      <Head title="Laporan & BI" />

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
            <FileSpreadsheet className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-ink">Laporan & Business Intelligence</h1>
            <p className="text-sm text-muted">
              Filter rentang tanggal, lalu export laporan resmi ber-kop Z-Lib.
            </p>
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
              Terapkan
            </button>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={exportUrl('pdf')}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3.5 py-2 text-sm font-medium text-ink hover:bg-surface2 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Export PDF
            </a>
            <a
              href={exportUrl('excel')}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-3.5 py-2 text-sm font-semibold text-white shadow-glow-accent hover:brightness-110 transition-all"
            >
              <FileDown className="w-4 h-4" />
              Export Excel
            </a>
          </div>
        </div>

        {/* Bento Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <StatCard icon={ClipboardList} label="Total Transaksi" value={summary.total_transaksi} accent />
          <StatCard icon={Wallet} label="Total Denda Periode Ini" value={`Rp ${Number(summary.total_denda).toLocaleString('id-ID')}`} />
          <StatCard icon={Clock3} label="Belum Dikembalikan" value={summary.belum_kembali} />
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-border/70 bg-surface/70 backdrop-blur-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/70 text-left text-xs text-muted">
                  <th className="px-5 py-3 font-medium">Anggota</th>
                  <th className="px-5 py-3 font-medium">Buku</th>
                  <th className="px-5 py-3 font-medium">Tgl Pinjam</th>
                  <th className="px-5 py-3 font-medium">Jatuh Tempo</th>
                  <th className="px-5 py-3 font-medium">Tgl Kembali</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Denda</th>
                </tr>
              </thead>
              <tbody>
                {transactions.data.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-muted text-sm">
                      Tidak ada transaksi pada periode ini.
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
              <span>
                Menampilkan {transactions.from}–{transactions.to} dari {transactions.total} transaksi
              </span>
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
