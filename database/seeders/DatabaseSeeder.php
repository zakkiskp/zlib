<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Urutan sangat penting:
     * User & Kategori/Rak harus ada dulu sebelum Buku (foreign key),
     * Buku harus ada dulu sebelum Peminjaman & Pengumuman.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            KategoriBukuSeeder::class,
            RakSeeder::class,
            BukuSeeder::class,
            PeminjamanSeeder::class,
            PengaturanSeeder::class,
            PengumumanSeeder::class,
        ]);
    }
}
