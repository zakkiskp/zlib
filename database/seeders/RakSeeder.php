<?php

namespace Database\Seeders;

use App\Models\Rak;
use Illuminate\Database\Seeder;

class RakSeeder extends Seeder
{
    public function run(): void
    {
        $daftarRak = [
            ['A1', 'Lantai 1 - Area Fiksi'],
            ['A2', 'Lantai 1 - Area Fiksi'],
            ['B1', 'Lantai 1 - Area Non-Fiksi'],
            ['B2', 'Lantai 1 - Area Non-Fiksi'],
            ['C1', 'Lantai 2 - Area Teknologi & Sains'],
            ['C2', 'Lantai 2 - Area Teknologi & Sains'],
            ['D1', 'Lantai 2 - Area Bisnis & Pengembangan Diri'],
            ['D2', 'Lantai 2 - Area Sejarah & Biografi'],
            ['E1', 'Lantai 3 - Area Anak & Komik'],
            ['E2', 'Lantai 3 - Area Referensi Umum'],
        ];

        foreach ($daftarRak as [$kode, $lokasi]) {
            Rak::create([
                'kode_rak' => $kode,
                'lokasi' => $lokasi,
                'keterangan' => "Rak penyimpanan {$kode}",
                'kapasitas' => 50,
            ]);
        }
    }
}
