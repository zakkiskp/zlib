<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Buku extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'buku';

    protected $fillable = [
        'judul_buku',
        'penulis',
        'penerbit',
        'tahun_terbit',
        'isbn',
        'rak_id',
        'deskripsi',
        'cover_url',
        'file_pdf_url',
        'file_pdf_url_en',
        'bahasa',
        'jumlah_halaman',
        'stok_tersedia',
        'total_stok',
        'rating_rata_rata',
        'jumlah_ulasan',
        'kondisi',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'rating_rata_rata' => 'decimal:1',
        ];
    }

    // ================= RELASI =================
    public function kategoris(): BelongsToMany
    {
        return $this->belongsToMany(KategoriBuku::class, 'kategori_buku_relasi', 'buku_id', 'kategori_buku_id');
    }

    public function rak(): BelongsTo
    {
        return $this->belongsTo(Rak::class, 'rak_id');
    }

    public function pembuat(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function peminjaman(): HasMany
    {
        return $this->hasMany(Peminjaman::class, 'buku_id');
    }

    public function ulasan(): HasMany
    {
        return $this->hasMany(UlasanBuku::class, 'buku_id');
    }

    public function koleksiPribadi(): HasMany
    {
        return $this->hasMany(KoleksiPribadi::class, 'buku_id');
    }

    // ================= ACCESSOR =================
    public function getStatusStokAttribute(): string
    {
        return $this->stok_tersedia > 0 ? 'tersedia' : 'habis';
    }
}
