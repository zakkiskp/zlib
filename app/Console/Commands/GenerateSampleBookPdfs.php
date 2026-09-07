<?php

namespace App\Console\Commands;

use App\Models\Buku;
use App\Services\SampleBookPdfGenerator;
use Illuminate\Console\Command;

/**
 * php artisan buku:generate-sample-pdfs
 *
 * Mengisi kolom `file_pdf_url` untuk semua buku yang masih kosong dengan
 * PDF "Pratinjau Baca" otomatis (lihat SampleBookPdfGenerator untuk
 * penjelasan lengkap kenapa isinya placeholder, bukan teks asli buku).
 *
 * Command ini AMAN dijalankan berkali-kali dan TIDAK butuh reseed/migrate
 * ulang — cocok dipakai langsung di database yang sudah pernah di-seed
 * sebelumnya (kasus Takep saat ini: 38 buku sudah ada, tinggal backfill
 * file_pdf_url-nya saja).
 */
class GenerateSampleBookPdfs extends Command
{
    protected $signature = 'buku:generate-sample-pdfs
                            {--force : Timpa juga buku yang sudah punya file_pdf_url (termasuk yang diupload manual oleh Admin)}
                            {--only= : Hanya proses satu ID buku tertentu, mis. --only=5}';

    protected $description = 'Generate PDF pratinjau baca (sample preview) otomatis untuk buku yang belum punya file_pdf_url';

    public function handle(): int
    {
        $force = (bool) $this->option('force');
        $onlyId = $this->option('only');

        $query = Buku::query();

        if ($onlyId) {
            $query->whereKey($onlyId);
        } elseif (!$force) {
            // Default: hanya isi yang masih kosong di SALAH SATU bahasa,
            // jangan sentuh buku yang KEDUA versinya (id & en) sudah ada
            // (baik dari run sebelumnya maupun upload manual admin).
            $query->where(function ($q) {
                $q->whereNull('file_pdf_url')->orWhere('file_pdf_url', '')
                    ->orWhereNull('file_pdf_url_en')->orWhere('file_pdf_url_en', '');
            });
        }

        $bukuList = $query->get();

        if ($bukuList->isEmpty()) {
            $this->info('Tidak ada buku yang perlu diproses. Semua buku sudah punya file_pdf_url. (Pakai --force untuk generate ulang semuanya.)');
            return self::SUCCESS;
        }

        $this->info(sprintf(
            'Memproses %d buku%s...',
            $bukuList->count(),
            $force ? ' (mode --force, file yang sudah ada akan ditimpa)' : ''
        ));

        $bar = $this->output->createProgressBar($bukuList->count());
        $bar->start();

        $berhasil = 0;
        $dilewati = 0;
        $gagal = 0;

        foreach ($bukuList as $buku) {
            try {
                // FIX (i18n PDF): "sudah ada sebelumnya" sekarang dicek untuk
                // KEDUA bahasa — buku baru dianggap "sudah lengkap" kalau
                // file_pdf_url MAUPUN file_pdf_url_en sudah terisi.
                $sudahAdaSebelumnya = !empty($buku->file_pdf_url) && !empty($buku->file_pdf_url_en);
                SampleBookPdfGenerator::generate($buku, $force);

                // FIX: sebelumnya dihitung dengan membandingkan string URL
                // sebelum/sesudah ("$url !== $before"). Itu salah untuk mode
                // --force, karena nama file bersifat deterministik
                // (slug-judul + id), jadi URL-nya TETAP SAMA walau file
                // fisiknya sudah benar-benar ditulis ulang -> selalu
                // ke-hitung "dilewati" padahal berhasil. Sinyal yang benar:
                // kalau --force dipakai, itu SELALU berhasil (re)generate;
                // kalau tidak, berhasil hanya jika sebelumnya memang kosong.
                if ($force || !$sudahAdaSebelumnya) {
                    $berhasil++;
                } else {
                    $dilewati++;
                }
            } catch (\Throwable $e) {
                $gagal++;
                $this->newLine();
                $this->error("Gagal memproses buku #{$buku->id} ({$buku->judul_buku}): {$e->getMessage()}");
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);
        $this->info("Selesai. Berhasil dibuat: {$berhasil} | Dilewati (sudah ada file): {$dilewati}" . ($gagal > 0 ? " | Gagal: {$gagal}" : ''));
        $this->line('File tersimpan di: storage/app/public/buku-pdf/');
        $this->line('Pastikan symlink storage sudah dibuat: php artisan storage:link');

        return self::SUCCESS;
    }
}
