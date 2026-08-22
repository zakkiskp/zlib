<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class KategoriBuku extends Model
{
    use HasFactory;

    protected $table = 'kategori_buku';

    protected $fillable = [
        'nama_kategori',
        'slug',
        'deskripsi',
        'icon',
    ];

    public function buku(): BelongsToMany
    {
        return $this->belongsToMany(Buku::class, 'kategori_buku_relasi', 'kategori_buku_id', 'buku_id');
    }
}
