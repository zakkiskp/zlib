<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Rak extends Model
{
    use HasFactory;

    protected $table = 'raks';

    protected $fillable = [
        'kode_rak',
        'lokasi',
        'keterangan',
        'kapasitas',
    ];

    public function buku(): HasMany
    {
        return $this->hasMany(Buku::class, 'rak_id');
    }
}
