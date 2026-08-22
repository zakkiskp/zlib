<?php

namespace Database\Seeders;

use App\Models\Pengumuman;
use App\Models\User;
use Illuminate\Database\Seeder;

class PengumumanSeeder extends Seeder
{
    public function run(): void
    {
        $adminId = User::where('role', 'admin')->value('id');

        Pengumuman::create([
            'judul' => 'Selamat Datang di Zlib!',
            'konten' => 'Jelajahi puluhan koleksi buku digital kami, ajukan peminjaman secara online, dan nikmati kemudahan sistem perpustakaan modern.',
            'gambar_url' => null, // upload lewat Admin > Announcement Manager
            'is_active' => true,
            'tanggal_mulai' => now()->toDateString(),
            'tanggal_selesai' => now()->addMonths(3)->toDateString(),
            'dibuat_oleh' => $adminId,
        ]);

        Pengumuman::create([
            'judul' => 'Jam Operasional Perpustakaan',
            'konten' => 'Perpustakaan buka Senin - Sabtu pukul 08.00 - 20.00 WIB. Layanan peminjaman online tetap aktif 24 jam.',
            'gambar_url' => null,
            'is_active' => true,
            'tanggal_mulai' => now()->toDateString(),
            'tanggal_selesai' => now()->addMonths(6)->toDateString(),
            'dibuat_oleh' => $adminId,
        ]);
    }
}
