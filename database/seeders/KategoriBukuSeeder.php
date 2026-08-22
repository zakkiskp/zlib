<?php

namespace Database\Seeders;

use App\Models\KategoriBuku;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class KategoriBukuSeeder extends Seeder
{
    public function run(): void
    {
        // 'icon' merujuk pada nama komponen di lucide-react, misal <BookOpen />, <Cpu />
        $daftarKategori = [
            ['nama' => 'Fiksi', 'icon' => 'book-open'],
            ['nama' => 'Non-Fiksi', 'icon' => 'book'],
            ['nama' => 'Teknologi & Komputer', 'icon' => 'cpu'],
            ['nama' => 'Sains', 'icon' => 'flask-conical'],
            ['nama' => 'Sejarah', 'icon' => 'landmark'],
            ['nama' => 'Biografi & Memoar', 'icon' => 'user'],
            ['nama' => 'Pengembangan Diri', 'icon' => 'sprout'],
            ['nama' => 'Bisnis & Ekonomi', 'icon' => 'briefcase'],
            ['nama' => 'Agama & Spiritual', 'icon' => 'moon-star'],
            ['nama' => 'Anak & Remaja', 'icon' => 'baby'],
            ['nama' => 'Komik & Graphic Novel', 'icon' => 'palette'],
            ['nama' => 'Kesehatan & Gaya Hidup', 'icon' => 'heart-pulse'],
        ];

        foreach ($daftarKategori as $k) {
            KategoriBuku::create([
                'nama_kategori' => $k['nama'],
                'slug' => Str::slug($k['nama']),
                'deskripsi' => 'Koleksi buku dengan kategori ' . $k['nama'] . '.',
                'icon' => $k['icon'],
            ]);
        }
    }
}
