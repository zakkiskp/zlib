<?php

namespace Database\Seeders;

use App\Models\Buku;
use App\Models\Peminjaman;
use App\Models\User;
use Illuminate\Database\Seeder;

class PeminjamanSeeder extends Seeder
{
    /**
     * Seeder ini WAJIB jalan setelah UserSeeder & BukuSeeder (lihat DatabaseSeeder).
     * Datanya dibuat realistis (bukan acak liar) supaya Dashboard di Langkah 3
     * punya tren peminjaman, kategori populer, dan antrean approval yang masuk akal.
     */
    public function run(): void
    {
        $anggotaIds = User::where('role', 'anggota')->pluck('id')->toArray();
        $petugasIds = User::where('role', 'petugas')->pluck('id')->toArray();
        $bukuIds = Buku::pluck('id')->toArray();

        if (empty($anggotaIds) || empty($bukuIds)) {
            return;
        }

        $durasiPinjam = 7; // hari — sesuai PengaturanSistem::durasi_pinjam_default
        $dendaPerHari = 1000; // sesuai PengaturanSistem::denda_per_hari

        // ---------- 1) Riwayat 6 bulan terakhir (tren naik supaya grafik menarik) ----------
        $bulanLalu = now()->subMonths(6)->startOfMonth();
        $jumlahPerBulan = [8, 11, 14, 12, 17, 15];

        foreach ($jumlahPerBulan as $i => $jumlah) {
            $bulanIni = $bulanLalu->copy()->addMonths($i);
            $isDuaBulanTerakhir = $i >= count($jumlahPerBulan) - 2;

            for ($n = 0; $n < $jumlah; $n++) {
                $tanggalPinjam = $bulanIni->copy()->addDays(random_int(0, 25));
                $jatuhTempo = $tanggalPinjam->copy()->addDays($durasiPinjam);

                // Sebagian transaksi di 2 bulan terakhir sengaja belum dikembalikan
                // (jadi status 'dipinjam' atau 'terlambat', bukan cuma histori selesai)
                if ($isDuaBulanTerakhir && random_int(1, 100) <= 30) {
                    $sudahLewatTempo = $jatuhTempo->isPast();

                    Peminjaman::create([
                        'user_id' => $anggotaIds[array_rand($anggotaIds)],
                        'buku_id' => $bukuIds[array_rand($bukuIds)],
                        'petugas_id' => $petugasIds[array_rand($petugasIds)],
                        'tanggal_pengajuan' => $tanggalPinjam->copy()->subDay(),
                        'tanggal_pinjam' => $tanggalPinjam,
                        'tanggal_jatuh_tempo' => $jatuhTempo,
                        'tanggal_kembali' => null,
                        'status' => $sudahLewatTempo ? 'terlambat' : 'dipinjam',
                        'denda' => $sudahLewatTempo ? $jatuhTempo->diffInDays(now()) * $dendaPerHari : 0,
                        'status_denda' => 'belum_lunas',
                    ]);

                    continue;
                }

                $kembaliTelat = random_int(1, 100) <= 25;
                $tanggalKembali = $kembaliTelat
                    ? $jatuhTempo->copy()->addDays(random_int(1, 5))
                    : $jatuhTempo->copy()->subDays(random_int(0, 3));
                $telat = $tanggalKembali->gt($jatuhTempo) ? $jatuhTempo->diffInDays($tanggalKembali) : 0;

                Peminjaman::create([
                    'user_id' => $anggotaIds[array_rand($anggotaIds)],
                    'buku_id' => $bukuIds[array_rand($bukuIds)],
                    'petugas_id' => $petugasIds[array_rand($petugasIds)],
                    'tanggal_pengajuan' => $tanggalPinjam->copy()->subDay(),
                    'tanggal_pinjam' => $tanggalPinjam,
                    'tanggal_jatuh_tempo' => $jatuhTempo,
                    'tanggal_kembali' => $tanggalKembali,
                    'status' => 'dikembalikan',
                    'denda' => $telat * $dendaPerHari,
                    'status_denda' => $telat > 0 ? (random_int(0, 1) ? 'lunas' : 'belum_lunas') : 'lunas',
                ]);
            }
        }

        // ---------- 2) Antrean approval petugas (untuk widget Circulation Desk) ----------
        for ($n = 0; $n < 6; $n++) {
            Peminjaman::create([
                'user_id' => $anggotaIds[array_rand($anggotaIds)],
                'buku_id' => $bukuIds[array_rand($bukuIds)],
                'petugas_id' => null,
                'tanggal_pengajuan' => now()->subHours(random_int(1, 36)),
                'tanggal_pinjam' => null,
                'tanggal_jatuh_tempo' => null,
                'tanggal_kembali' => null,
                'status' => 'menunggu_persetujuan',
                'denda' => 0,
                'status_denda' => 'belum_lunas',
            ]);
        }

        // ---------- 3) Beberapa pengajuan ditolak (realisme data) ----------
        for ($n = 0; $n < 3; $n++) {
            Peminjaman::create([
                'user_id' => $anggotaIds[array_rand($anggotaIds)],
                'buku_id' => $bukuIds[array_rand($bukuIds)],
                'petugas_id' => $petugasIds[array_rand($petugasIds)],
                'tanggal_pengajuan' => now()->subDays(random_int(1, 10)),
                'tanggal_pinjam' => null,
                'tanggal_jatuh_tempo' => null,
                'tanggal_kembali' => null,
                'status' => 'ditolak',
                'denda' => 0,
                'status_denda' => 'belum_lunas',
                'catatan' => 'Stok tidak tersedia saat pengajuan diajukan.',
            ]);
        }
    }
}
