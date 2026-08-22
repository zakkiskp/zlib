<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KoleksiPribadi extends Model
{
    use HasFactory;

    protected $table = 'koleksi_pribadi';

    protected $fillable = [
        'user_id',
        'buku_id',
        'is_favorit',
        'halaman_terakhir',
        'catatan_bacaan',
    ];

    protected function casts(): array
    {
        return [
            'is_favorit' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function buku(): BelongsTo
    {
        return $this->belongsTo(Buku::class, 'buku_id');
    }
}
