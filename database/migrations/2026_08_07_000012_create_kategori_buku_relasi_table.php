<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tabel relasi many-to-many Buku <-> Kategori — persis "kategoribuku_relasi"
     * di ERD lembar soal (dinamai dengan underscore mengikuti konvensi penamaan
     * tabel lain di project ini: kategori_buku, ulasan_buku, koleksi_pribadi).
     * Satu buku bisa punya beberapa kategori, satu kategori bisa dipakai banyak buku.
     */
    public function up(): void
    {
        Schema::create('kategori_buku_relasi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kategori_buku_id')->constrained('kategori_buku')->cascadeOnDelete();
            $table->foreignId('buku_id')->constrained('buku')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['kategori_buku_id', 'buku_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kategori_buku_relasi');
    }
};
