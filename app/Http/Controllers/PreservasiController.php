<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Buku;
use App\Services\AuditLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * FIX BUG #2 (Unknown column 'aktivitas' in 'where clause'):
 *
 * ROOT CAUSE: Controller ini awalnya ditulis dengan asumsi tabel audit_logs
 * berkolom `aktivitas`, `model_type`, `model_id`, `data_baru` (JSON). Tapi
 * tabel audit_logs yang SUNGGUHAN di database Anda adalah yang dibuat di
 * Tahap 1 (migration 2026_08_19_100001_create_audit_logs_table), dengan
 * kolom: user_id, user_name, user_role, action, module, description,
 * ip_address, user_agent, created_at — TIDAK ADA kolom `aktivitas` ataupun
 * `data_baru`. Makanya query `where('aktivitas', ...)` gagal.
 *
 * FIX: semua query/insert diarahkan ke kolom yang benar-benar ada, dan
 * dipakaikan `AuditLogger::log()` (service yang sama dipakai fitur Audit
 * Log Tahap 1) supaya konsisten satu skema di seluruh aplikasi.
 *
 * PENTING — kontrak data ke frontend TIDAK berubah: array $usulan yang
 * dikirim ke Inertia::render() masih persis berbentuk
 * {id, nama, judul, alasan, waktu} seperti sebelumnya, supaya
 * Petugas/Preservasi/Index.jsx Anda TIDAK perlu diubah sama sekali. Karena
 * skema baru tidak punya kolom JSON terpisah untuk `judul`/`alasan`, kedua
 * nilai itu disimpan dalam satu kalimat `description` dengan format tetap,
 * lalu di-parse balik lewat regex saat dibaca. Ini trik yang aman selama
 * format string di storeUsulan() & regex di index() tetap sinkron seperti
 * di bawah — jangan diubah salah satu tanpa yang lain.
 */
class PreservasiController extends Controller
{
    private const USULAN_PATTERN = '/^Usulan buku baru: "(.+?)" — Alasan: (.*)$/';

    public function index(Request $request)
    {
        $query = Buku::select(['id', 'judul_buku', 'cover_url', 'kondisi']);

        if ($search = $request->string('q')->trim()->toString()) {
            $query->where('judul_buku', 'like', "%{$search}%");
        }

        $buku = $query->orderBy('judul_buku')->paginate(10)->withQueryString();

        $usulan = AuditLog::where('module', 'preservasi')
            ->where('action', 'create')
            ->latest('created_at')
            ->take(10)
            ->get()
            ->map(function ($log) {
                preg_match(self::USULAN_PATTERN, $log->description, $matches);

                return [
                    'id' => $log->id,
                    'nama' => $log->user_name ?? '—',
                    'judul' => $matches[1] ?? $log->description,
                    'alasan' => $matches[2] ?? '-',
                    'waktu' => $log->created_at->diffForHumans(),
                ];
            });

        return Inertia::render('Petugas/Preservasi', [
            'buku' => $buku,
            'filters' => $request->only(['q']),
            'usulan' => $usulan,
        ]);
    }

    public function updateKondisi(Request $request, Buku $buku)
    {
        $validated = $request->validate([
            'kondisi' => 'required|in:baik,rusak,hilang',
        ]);

        $buku->update($validated);

        AuditLogger::log(
            'update',
            'preservasi',
            "Mengubah kondisi buku \"{$buku->judul_buku}\" menjadi \"{$validated['kondisi']}\"."
        );

        return back()->with('success', 'Kondisi buku diperbarui.');
    }

    public function storeUsulan(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'alasan' => 'nullable|string|max:500',
        ]);

        // Format string ini HARUS sinkron dengan self::USULAN_PATTERN di atas.
        $alasan = $validated['alasan'] ?: '-';
        AuditLogger::log(
            'create',
            'preservasi',
            "Usulan buku baru: \"{$validated['judul']}\" — Alasan: {$alasan}"
        );

        return back()->with('success', 'Usulan buku baru terkirim.');
    }
}
