<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // ================= ADMIN =================
        // Password default semua akun demo: password123
        User::create([
            'no_anggota' => 'ADM-0001',
            'username' => 'admin',
            'name' => 'Zaki Firmansyah',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'avatar_url' => 'https://i.pravatar.cc/300?img=12',
            'phone' => '081234567890',
            'alamat' => 'Malang, Jawa Timur',
            'status' => 'aktif',
            'email_verified_at' => now(),
        ]);

        // ================= PETUGAS =================
        $daftarPetugas = [
            ['name' => 'Siti Nurhaliza', 'email' => 'petugas@gmail.com', 'username' => 'siti.petugas', 'no' => 'PTG-0001', 'shift' => 'pagi', 'img' => 47],
            ['name' => 'Budi Santoso', 'email' => 'petugas2@gmail.com', 'username' => 'budi.petugas', 'no' => 'PTG-0002', 'shift' => 'siang', 'img' => 33],
        ];

        foreach ($daftarPetugas as $p) {
            User::create([
                'no_anggota' => $p['no'],
                'username' => $p['username'],
                'name' => $p['name'],
                'email' => $p['email'],
                'password' => Hash::make('password123'),
                'role' => 'petugas',
                'avatar_url' => "https://i.pravatar.cc/300?img={$p['img']}",
                'phone' => '0812345678' . random_int(10, 99),
                'alamat' => 'Malang, Jawa Timur',
                'shift_kerja' => $p['shift'],
                'status' => 'aktif',
                'email_verified_at' => now(),
            ]);
        }

        // ================= ANGGOTA / PEMINJAM =================
        // zaki@gmail.com dipakai sebagai akun demo utama untuk tombol "1-Click Quick Demo Login"
        $daftarAnggota = [
            ['name' => 'Ahmad Fauzi', 'email' => 'zaki@gmail.com', 'username' => 'zaki', 'img' => 5],
            ['name' => 'Dewi Lestari', 'email' => 'dewi@gmail.com', 'username' => 'dewi.lestari', 'img' => 25],
            ['name' => 'Rizky Pratama', 'email' => 'rizky@gmail.com', 'username' => 'rizky.pratama', 'img' => 8],
            ['name' => 'Putri Ayu Wardani', 'email' => 'putri@gmail.com', 'username' => 'putri.ayu', 'img' => 45],
            ['name' => 'Fajar Nugroho', 'email' => 'fajar@gmail.com', 'username' => 'fajar.nugroho', 'img' => 14],
            ['name' => 'Anisa Rahmawati', 'email' => 'anisa@gmail.com', 'username' => 'anisa.rahmawati', 'img' => 21],
            ['name' => 'Doni Kusuma', 'email' => 'doni@gmail.com', 'username' => 'doni.kusuma', 'img' => 15],
            ['name' => 'Melati Sari', 'email' => 'melati@gmail.com', 'username' => 'melati.sari', 'img' => 29],
            ['name' => 'Hendra Wijaya', 'email' => 'hendra@gmail.com', 'username' => 'hendra.wijaya', 'img' => 51],
            ['name' => 'Intan Permata', 'email' => 'intan@gmail.com', 'username' => 'intan.permata', 'img' => 32],
        ];

        foreach ($daftarAnggota as $i => $a) {
            User::create([
                'no_anggota' => 'ANG-' . str_pad((string) ($i + 1), 4, '0', STR_PAD_LEFT),
                'username' => $a['username'],
                'name' => $a['name'],
                'email' => $a['email'],
                'password' => Hash::make('password123'),
                'role' => 'anggota',
                'avatar_url' => "https://i.pravatar.cc/300?img={$a['img']}",
                'phone' => '08123456' . random_int(1000, 9999),
                'alamat' => fake('id_ID')->address(),
                'status' => 'aktif',
                'email_verified_at' => now(),
            ]);
        }
    }
}
