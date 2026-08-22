<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'no_anggota',
        'username',
        'name',
        'email',
        'password',
        'role',
        'avatar_url',
        'phone',
        'alamat',
        'shift_kerja',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Auto-generate `username` dari prefix email kalau tidak diisi manual.
     * Ini penting supaya form Register bawaan Breeze (yang belum tanya
     * username) tetap bisa jalan tanpa error, tapi kolomnya tetap selalu terisi.
     */
    protected static function booted(): void
    {
        static::creating(function (User $user) {
            if (empty($user->username)) {
                $base = Str::slug(explode('@', $user->email)[0], '');
                $username = $base;
                $i = 1;
                while (static::where('username', $username)->exists()) {
                    $username = $base . $i++;
                }
                $user->username = $username;
            }
        });
    }

    // ================= HELPER ROLE =================
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isPetugas(): bool
    {
        return $this->role === 'petugas';
    }

    public function isAnggota(): bool
    {
        return $this->role === 'anggota';
    }

    // ================= RELASI =================
    public function peminjaman(): HasMany
    {
        return $this->hasMany(Peminjaman::class, 'user_id');
    }

    public function peminjamanDiproses(): HasMany
    {
        return $this->hasMany(Peminjaman::class, 'petugas_id');
    }

    public function ulasanBuku(): HasMany
    {
        return $this->hasMany(UlasanBuku::class);
    }

    public function koleksiPribadi(): HasMany
    {
        return $this->hasMany(KoleksiPribadi::class);
    }

    public function notifikasi(): HasMany
    {
        return $this->hasMany(Notifikasi::class);
    }

    public function bukuDitambahkan(): HasMany
    {
        return $this->hasMany(Buku::class, 'created_by');
    }
}
