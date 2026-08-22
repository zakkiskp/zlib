import { useEffect, useRef, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { resolveMediaUrl, inputClassWithIcon, selectClass, dateInputClass } from '@/Utils/ui';
import {
  ShieldCheck,
  Search,
  CalendarRange,
  RotateCcw,
  Globe,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Pencil,
  Trash2,
  LogIn,
  LogOut,
  CheckCircle,
  XCircle,
  Download,
} from 'lucide-react';

const ACTION_META = {
  create: { label: 'Create', icon: PlusCircle, className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  update: { label: 'Update', icon: Pencil, className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  delete: { label: 'Delete', icon: Trash2, className: 'bg-red-500/10 text-red-600 dark:text-red-400' },
  login: { label: 'Login', icon: LogIn, className: 'bg-violet-500/10 text-violet-600 dark:text-violet-400' },
  logout: { label: 'Logout', icon: LogOut, className: 'bg-surface2 text-muted' },
  approve: { label: 'Approve', icon: CheckCircle, className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  reject: { label: 'Reject', icon: XCircle, className: 'bg-red-500/10 text-red-600 dark:text-red-400' },
  export: { label: 'Export', icon: Download, className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
};

function ActionBadge({ action }) {
  const meta = ACTION_META[action] || { label: action, icon: ShieldCheck, className: 'bg-surface2 text-muted' };
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${meta.className}`}>
      <Icon className="w-3 h-3" />
      {meta.label}
    </span>
  );
}

export default function AuditLogIndex({ logs, filters, actionOptions }) {
  const [search, setSearch] = useState(filters.search || '');
  const [action, setAction] = useState(filters.action || '');
  const [from, setFrom] = useState(filters.from || '');
  const [to, setTo] = useState(filters.to || '');
  const debounceRef = useRef(null);

  function applyFilters(next = {}) {
    router.get(
      route('admin.audit-log'),
      { search, action, from, to, ...next },
      { preserveState: true, replace: true, only: ['logs', 'filters'] }
    );
  }

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      applyFilters({ search });
    }, 400);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function resetFilters() {
    setSearch('');
    setAction('');
    setFrom('');
    setTo('');
    router.get(route('admin.audit-log'), {}, { preserveState: true, replace: true, only: ['logs', 'filters'] });
  }

  return (
    <AuthenticatedLayout>
      <Head title="Audit Log" />

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-ink">System Audit Log</h1>
            <p className="text-sm text-muted">
              Rekam jejak seluruh aktivitas penting di sistem Z-Lib.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-6 rounded-2xl border border-border/70 bg-surface/70 backdrop-blur-md p-4 flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari deskripsi, nama user, atau modul..."
              className={inputClassWithIcon}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className={selectClass}
            value={action}
            onChange={(e) => {
              setAction(e.target.value);
              applyFilters({ action: e.target.value });
            }}
          >
            <option value="">Semua Action</option>
            {actionOptions.map((opt) => (
              <option key={opt} value={opt}>
                {ACTION_META[opt]?.label || opt}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <CalendarRange className="w-4 h-4 text-muted shrink-0" />
            <input
              type="date"
              className={dateInputClass}
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                applyFilters({ from: e.target.value });
              }}
            />
            <span className="text-muted text-sm">—</span>
            <input
              type="date"
              className={dateInputClass}
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                applyFilters({ to: e.target.value });
              }}
            />
          </div>

          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted hover:bg-surface2 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>

        {/* Table */}
        <div className="mt-5 rounded-2xl border border-border/70 bg-surface/70 backdrop-blur-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/70 text-left text-xs text-muted">
                  <th className="px-5 py-3 font-medium">Waktu</th>
                  <th className="px-5 py-3 font-medium">User</th>
                  <th className="px-5 py-3 font-medium">Action</th>
                  <th className="px-5 py-3 font-medium">Modul</th>
                  <th className="px-5 py-3 font-medium">Deskripsi</th>
                  <th className="px-5 py-3 font-medium">IP Address</th>
                </tr>
              </thead>
              <tbody>
                {logs.data.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-muted text-sm">
                      Tidak ada aktivitas yang cocok dengan filter.
                    </td>
                  </tr>
                )}
                {logs.data.map((log, idx) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(idx * 0.02, 0.3) }}
                    className="border-b border-border/50 hover:bg-surface2 transition-colors"
                  >
                    <td className="px-5 py-3 whitespace-nowrap text-muted text-xs">
                      {new Date(log.created_at).toLocaleString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full overflow-hidden bg-surface2 shrink-0 flex items-center justify-center text-[10px] font-semibold text-muted">
                          {log.user?.avatar_url ? (
                            <img src={resolveMediaUrl(log.user.avatar_url)} className="w-full h-full object-cover" alt="" />
                          ) : (
                            (log.user_name || '?').charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="text-ink font-medium leading-tight">{log.user_name}</p>
                          <p className="text-[11px] text-muted capitalize leading-tight">{log.user_role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <ActionBadge action={log.action} />
                    </td>
                    <td className="px-5 py-3 text-muted capitalize">{log.module}</td>
                    <td className="px-5 py-3 text-muted max-w-md">{log.description}</td>
                    <td className="px-5 py-3 text-muted font-mono text-xs">
                      <span className="inline-flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {log.ip_address || '-'}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {logs.data.length > 0 && (
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-border/70 text-xs text-muted">
              <span>
                Menampilkan {logs.from}–{logs.to} dari {logs.total} aktivitas
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={!logs.prev_page_url}
                  onClick={() => router.get(logs.prev_page_url, {}, { preserveState: true, only: ['logs'] })}
                  className="p-1.5 rounded-md border border-border disabled:opacity-40 hover:bg-surface2 transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  disabled={!logs.next_page_url}
                  onClick={() => router.get(logs.next_page_url, {}, { preserveState: true, only: ['logs'] })}
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
