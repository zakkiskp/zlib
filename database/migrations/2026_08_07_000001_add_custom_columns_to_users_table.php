<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Menjalankan migration.
     * Menambahkan kolom-kolom kustom ke tabel users bawaan Laravel
     * untuk mendukung role-based access (admin, petugas, anggota),
     * avatar, nomor anggota, dan data operasional lainnya.
     *
     * v2: tambah kolom `username` (nullable) supaya sesuai ERD di lembar soal.
     * Nullable karena form Register bawaan Breeze belum minta username secara
     * eksplisit — User model otomatis generate username dari email kalau kosong
     * (lihat App\Models\User::booted()), jadi tetap terisi & aman dipakai.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('no_anggota')->unique()->nullable()->after('id');
            $table->string('username', 50)->unique()->nullable()->after('no_anggota');
            $table->enum('role', ['admin', 'petugas', 'anggota'])->default('anggota')->after('email');
            $table->string('avatar_url')->nullable()->after('role');
            $table->string('phone', 20)->nullable()->after('avatar_url');
            $table->text('alamat')->nullable()->after('phone');
            $table->enum('shift_kerja', ['pagi', 'siang', 'malam'])->nullable()->after('alamat');
            $table->enum('status', ['aktif', 'nonaktif'])->default('aktif')->after('shift_kerja');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'no_anggota',
                'username',
                'role',
                'avatar_url',
                'phone',
                'alamat',
                'shift_kerja',
                'status',
            ]);
        });
    }
};
