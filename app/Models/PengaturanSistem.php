<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PengaturanSistem extends Model
{
    protected $table = 'pengaturan_sistem';

    protected $fillable = [
        'key',
        'value',
        'keterangan',
    ];

    /**
     * Ambil satu nilai pengaturan berdasarkan key.
     * Contoh: PengaturanSistem::get('denda_per_hari', 1000)
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        return static::where('key', $key)->value('value') ?? $default;
    }
}
