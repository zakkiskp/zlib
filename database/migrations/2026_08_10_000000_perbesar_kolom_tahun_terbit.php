<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Kolom `tahun_terbit` sebelumnya bertipe YEAR bawaan MySQL yang cuma
     * bisa nyimpen tahun 1901-2155 — gak cukup buat buku klasik beneran
     * (contoh: Pride and Prejudice tahun 1813, bikin migration
     * 2026_08_10_000001 gagal dengan error "Out of range value").
     *
     * Diperlebar jadi SMALLINT supaya bisa nampung tahun berapa pun.
     * Timestamp file ini SENGAJA dibuat lebih awal (_000000) daripada
     * migration ganti buku (_000001) supaya PASTI jalan duluan.
     *
     * Pakai raw SQL (bukan Schema::table()->change()) supaya TIDAK perlu
     * install package tambahan doctrine/dbal. Data yang sudah ada aman/
     * tidak hilang — ini cuma memperlebar tipe kolom, bukan hapus+bikin ulang.
     */
    public function up(): void
    {
        DB::statement('ALTER TABLE buku MODIFY tahun_terbit SMALLINT UNSIGNED NULL');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE buku MODIFY tahun_terbit YEAR NULL');
    }
};
