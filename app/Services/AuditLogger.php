<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

/**
 * Helper terpusat untuk mencatat aktivitas user ke tabel audit_logs.
 *
 * Contoh pemakaian di controller mana pun:
 *   AuditLogger::log('update', 'buku', "Mengubah stok buku \"{$buku->judul_buku}\".");
 *
 * Disarankan mulai dipanggil juga di controller-controller Langkah 7 & 8
 * (Data Buku, Kategori, Denda, User Management) agar Audit Log benar-benar
 * merekam seluruh aktivitas sistem, bukan hanya modul Tahap 1 ini.
 */
class AuditLogger
{
    public static function log(string $action, string $module, string $description): void
    {
        $user = Auth::user();

        AuditLog::create([
            'user_id' => $user?->id,
            'user_name' => $user?->name ?? 'System',
            'user_role' => $user?->role ?? '-',
            'action' => $action,
            'module' => $module,
            'description' => $description,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
            'created_at' => now(),
        ]);
    }
}
