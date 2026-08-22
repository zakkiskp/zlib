<?php

namespace Database\Seeders;

use App\Models\SystemSetting;
use Illuminate\Database\Seeder;

class SystemSettingSeeder extends Seeder
{
    /**
     * Nilai default konfigurasi sistem Z-Lib.
     * Jalankan: php artisan db:seed --class=SystemSettingSeeder
     */
    public function run(): void
    {
        $defaults = [
            'site_name' => 'Z-Lib',
            'site_logo' => null,
            'denda_per_hari' => 1000,
            'durasi_pinjam_maks' => 7,
            'maks_buku_dipinjam' => 3,
        ];

        foreach ($defaults as $key => $value) {
            SystemSetting::firstOrCreate(['key' => $key], ['value' => $value]);
        }
    }
}
