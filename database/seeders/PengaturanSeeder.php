<?php

namespace Database\Seeders;

use App\Models\PengaturanSistem;
use Illuminate\Database\Seeder;

class PengaturanSeeder extends Seeder
{
    public function run(): void
    {
        $daftarPengaturan = [
            ['key' => 'nama_perpustakaan', 'value' => 'Zlib - Digital Library', 'keterangan' => 'Nama resmi sistem perpustakaan'],
            ['key' => 'durasi_pinjam_default', 'value' => '7', 'keterangan' => 'Durasi maksimal peminjaman buku (hari)'],
            ['key' => 'denda_per_hari', 'value' => '1000', 'keterangan' => 'Denda keterlambatan per hari (Rupiah)'],
            ['key' => 'max_buku_dipinjam', 'value' => '3', 'keterangan' => 'Jumlah maksimal buku yang boleh dipinjam bersamaan'],
            ['key' => 'max_perpanjangan', 'value' => '1', 'keterangan' => 'Jumlah maksimal perpanjangan per peminjaman'],
        ];

        foreach ($daftarPengaturan as $p) {
            PengaturanSistem::create($p);
        }
    }
}
