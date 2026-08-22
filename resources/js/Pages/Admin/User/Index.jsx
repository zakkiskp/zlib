import { useState, useRef } from 'react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Katalog/Pagination';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { useConfirm } from '@/Hooks/useConfirm';
import { resolveMediaUrl } from '@/Utils/ui';
import { useLanguage } from '@/Contexts/LanguageContext';
import { Search, KeyRound } from 'lucide-react';

const ROLE_COLOR = {
    admin: 'bg-red-500/10 text-red-500',
    petugas: 'bg-amber-500/10 text-amber-500',
    anggota: 'bg-accent/10 text-accent',
};

function UserIndex({ users, filters }) {
    const [q, setQ] = useState(filters.q || '');
    const debounceRef = useRef(null);
    const { confirmState, confirm, handleConfirm, handleCancel } = useConfirm();
    const { t } = useLanguage();

    const cari = (value, role) => {
        router.get(
            '/admin/user',
            { q: value || undefined, role: role || undefined },
            { preserveState: true, preserveScroll: true, replace: true, only: ['users', 'filters'] },
        );
    };

    const onSearch = (e) => {
        const value = e.target.value;
        setQ(value);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => cari(value, filters.role), 350);
    };

    const ubahRole = (id, role) => {
        router.patch(`/admin/user/${id}/role`, { role }, { preserveScroll: true, preserveState: true });
    };

    const ubahStatus = (id, status) => {
        router.patch(`/admin/user/${id}/status`, { status }, { preserveScroll: true, preserveState: true });
    };

    const reset = async (id, nama) => {
        const ok = await confirm('Reset Password?', `Password ${nama} akan direset ke "password123".`);
        if (ok) {
            router.post(`/admin/user/${id}/reset-password`, {}, { preserveScroll: true });
        }
    };

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-xl font-semibold text-ink">User & Role Management</h2>
                <p className="text-sm text-muted">{users.total} akun terdaftar di sistem.</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative max-w-sm flex-1">
                    <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                        value={q}
                        onChange={onSearch}
                        placeholder="Cari nama atau email…"
                        className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm text-ink placeholder:text-muted focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
                    />
                </div>
                <div className="flex w-fit gap-1 rounded-lg border border-border bg-surface p-1">
                    {['', 'admin', 'petugas', 'anggota'].map((r) => (
                        <button
                            key={r || 'semua'}
                            onClick={() => cari(q, r)}
                            className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize ${
                                (filters.role || '') === r ? 'bg-accent/10 text-accent' : 'text-muted hover:text-ink'
                            }`}
                        >
                            {r || 'Semua'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border bg-surface">
                {users.data.map((u) => (
                    <div key={u.id} className="flex flex-wrap items-center gap-3 border-b border-border/60 p-4 last:border-0">
                        <img 
                            src={resolveMediaUrl(u.avatar_url)} 
                            alt={u.name} 
                            className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-border" 
                        />
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-ink">{u.name}</p>
                            <p className="truncate text-xs text-muted">{u.email}</p>
                        </div>
                        <select
                            value={u.role}
                            onChange={(e) => ubahRole(u.id, e.target.value)}
                            className={`shrink-0 rounded-lg border-0 px-2.5 py-1.5 text-xs font-medium capitalize ${ROLE_COLOR[u.role]}`}
                        >
                            <option value="admin">Admin</option>
                            <option value="petugas">Petugas</option>
                            <option value="anggota">Anggota</option>
                        </select>
                        <button
                            onClick={() => ubahStatus(u.id, u.status === 'aktif' ? 'nonaktif' : 'aktif')}
                            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                                u.status === 'aktif' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-surface2 text-muted'
                            }`}
                        >
                            {u.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                        </button>
                        <button
                            onClick={() => reset(u.id, u.name)}
                            title="Reset Password"
                            className="shrink-0 rounded-lg border border-border p-2 text-muted hover:bg-surface2 hover:text-ink"
                        >
                            <KeyRound size={14} />
                        </button>
                    </div>
                ))}
            </div>
            <Pagination links={users.links} />

            <ConfirmDialog
                open={confirmState.open}
                title={confirmState.title}
                message={confirmState.message}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                danger={false}
            />
        </div>
    );
}

UserIndex.layout = (page) => <AuthenticatedLayout title="User & Role Management">{page}</AuthenticatedLayout>;

export default UserIndex;