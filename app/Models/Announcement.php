<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    protected $fillable = [
        'title',
        'content',
        'banner_image',
        'type',
        'start_date',
        'end_date',
        'is_active',
        'created_by',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Scope untuk dashboard Anggota: hanya pengumuman yang aktif
     * dan berada dalam rentang tanggal tayang.
     *
     * FIX BUG (pengumuman expired masih muncul): sebelumnya `now()`
     * dioper langsung ke whereDate(), yang di-serialize memakai timezone
     * aplikasi. Kalau APP_TIMEZONE belum di-set benar (lihat fix di
     * config/app.php), ini bisa bikin "hari ini" meleset beberapa jam.
     * Sekarang eksplisit pakai now()->toDateString() (format 'Y-m-d'
     * bersih, tidak ambigu) supaya perbandingan tanggal presisi terlepas
     * dari isu timezone di level lain.
     */
    public function scopeActive($query)
    {
        $today = now()->toDateString();

        return $query->where('is_active', true)
            ->where(function ($q) use ($today) {
                $q->whereNull('start_date')->orWhereDate('start_date', '<=', $today);
            })
            ->where(function ($q) use ($today) {
                $q->whereNull('end_date')->orWhereDate('end_date', '>=', $today);
            });
    }
}
