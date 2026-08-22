<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Peminjaman extends Model
{
    use HasFactory;

    protected $table = 'peminjaman';

    protected $fillable = [
        'user_id',
        'buku_id',
        'petugas_id',
        'tanggal_pengajuan',
        'tanggal_pinjam',
        'tanggal_jatuh_tempo',
        'tanggal_kembali',
        'status',
        'jumlah_perpanjangan',
        'status_perpanjangan',
        'denda',
        'status_denda',
        'catatan',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_pengajuan' => 'datetime',
            'tanggal_pinjam' => 'date',
            'tanggal_jatuh_tempo' => 'date',
            'tanggal_kembali' => 'date',
            'denda' => 'decimal:2',
        ];
    }

    // ================= RELASI =================
    public function anggota(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function petugas(): BelongsTo
    {
        return $this->belongsTo(User::class, 'petugas_id');
    }

    public function buku(): BelongsTo
    {
        return $this->belongsTo(Buku::class, 'buku_id');
    }

    // ================= HELPER =================
    public function sisaHari(): int
    {
        if (!$this->tanggal_jatuh_tempo) {
            return 0;
        }

        return now()->startOfDay()->diffInDays($this->tanggal_jatuh_tempo, false);
    }
}
