<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class SystemSetting extends Model
{
    protected $table = 'system_settings';

    protected $fillable = ['key', 'value'];

    /**
     * Ambil satu nilai konfigurasi berdasarkan key, dengan cache permanen.
     * Cache otomatis dibersihkan setiap kali set() dipanggil.
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        return Cache::rememberForever("setting.$key", function () use ($key, $default) {
            return static::where('key', $key)->value('value') ?? $default;
        });
    }

    public static function set(string $key, mixed $value): void
    {
        static::updateOrCreate(['key' => $key], ['value' => $value]);
        Cache::forget("setting.$key");
    }

    public static function allSettings(): array
    {
        return static::pluck('value', 'key')->toArray();
    }
}
