<?php

namespace App\Services;

use App\Models\Buku;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Menghasilkan file PDF "Pratinjau Baca" (sample preview reading) secara
 * otomatis untuk satu buku, lalu menyimpannya ke storage/app/public/buku-pdf
 * dan mengisi kolom `file_pdf_url` (versi ID) & `file_pdf_url_en` (versi EN).
 *
 * ------------------------------------------------------------------
 * PENTING — BATASAN HAK CIPTA (baca sebelum mengubah class ini):
 * ------------------------------------------------------------------
 * Sebagian besar judul di BukuSeeder (Harry Potter, Naruto, One Piece,
 * Atomic Habits, Sapiens, Clean Code, dst) adalah karya berhak cipta aktif
 * milik penerbit/penulis aslinya. Class ini TIDAK mengambil, menyimpan,
 * atau mereproduksi teks asli buku-buku tersebut dengan cara apa pun.
 * Cover buku (gambar sampul) BUKAN teks/isi buku itu sendiri — menampilkan
 * gambar sampul untuk mengenali buku adalah praktik standar semua katalog
 * perpustakaan/toko buku (dipakai juga di Katalog & Admin Data Buku), jadi
 * aman dipakai di sini sama seperti di halaman lain aplikasi ini.
 *
 * Konten "Bab" yang dihasilkan adalah tulisan ORIGINAL milik sendiri,
 * dikelompokkan per KATEGORI buku (lihat SampleReadingContent.php) —
 * BUKAN Lorem Ipsum, dan BUKAN kutipan dari buku manapun. Pola ini
 * meniru fitur "pratinjau bab" yang lazim dipakai platform e-book resmi
 * (mis. Google Play Books / Amazon "Look Inside").
 *
 * ------------------------------------------------------------------
 * FIX BUG (isi bacaan PDF ikut i18n ID/EN):
 * ------------------------------------------------------------------
 * PDF adalah file STATIS — tidak seperti komponen React yang bisa
 * langsung membaca ulang LanguageContext saat tombol bahasa ditekan.
 * Solusinya: generate() sekarang membuat DUA file PDF sekaligus per buku
 * (satu Bahasa Indonesia, satu Inggris — isi bacaan MAUPUN semua label
 * statisnya seperti "Bab"/"Chapter", "Sinopsis"/"Synopsis", dst, ikut
 * diterjemahkan lewat method labels()), disimpan ke 2 kolom terpisah
 * (file_pdf_url & file_pdf_url_en). PdfReaderPanel.jsx di sisi frontend
 * lah yang memilih & memuat ulang file yang sesuai begitu bahasa aktif
 * di aplikasi berubah — lihat komentar di file itu untuk detail alurnya.
 *
 * Kalau Anda punya PDF yang MEMANG sah untuk dipakai (buku domain publik
 * yang diunduh dari sumber legal, karya tulis sendiri, atau file
 * berlisensi), timpa hasil generator ini lewat:
 *   1) Admin > Data Buku > Edit > Upload PDF (drag & drop), ATAU
 *   2) Copy manual ke storage/app/public/buku-pdf/ lalu jalankan
 *      `php artisan buku:generate-sample-pdfs --only={id}` (akan di-skip
 *      karena sudah terisi) — atau update kolom file_pdf_url langsung.
 */
class SampleBookPdfGenerator
{
    /** Jumlah "Bab" pratinjau yang dibuat per buku (4 paragraf/varian di SampleReadingContent = 4 bab, memenuhi minimal 3-4 halaman bacaan). */
    private const CHAPTER_COUNT = 4;

    /** Batas waktu (detik) mengambil gambar cover eksternal sebelum menyerah & fallback. */
    private const COVER_FETCH_TIMEOUT = 5;

    /** Kolom DB yang dipakai untuk tiap bahasa. */
    private const URL_COLUMN = [
        'id' => 'file_pdf_url',
        'en' => 'file_pdf_url_en',
    ];

    /**
     * Generate (atau lewati) PDF pratinjau untuk satu buku, DALAM 2 BAHASA
     * SEKALIGUS (id & en).
     *
     * @param  Buku  $buku
     * @param  bool  $force  Timpa walau file_pdf_url(_en) sudah terisi (mis. upload manual admin)
     * @return array{id: ?string, en: ?string}  URL relatif tiap bahasa yang tersimpan
     */
    public static function generate(Buku $buku, bool $force = false): array
    {
        $result = [
            'id' => $buku->file_pdf_url,
            'en' => $buku->file_pdf_url_en,
        ];

        // Kalau KEDUANYA sudah terisi dan tidak dipaksa, tidak perlu kerja
        // apa-apa lagi (idempotent, melindungi file asli upload manual admin).
        if (!$force && !empty($result['id']) && !empty($result['en'])) {
            return $result;
        }

        $kategoriNama = optional($buku->kategoris()->first())->nama_kategori ?? '-';

        // Cover & logo sama untuk kedua bahasa — cukup diunduh/dibaca SEKALI
        // per buku, bukan dua kali, supaya generate tidak lambat 2x lipat.
        $coverDataUri = self::fetchCoverAsDataUri($buku->cover_url);
        $logoDataUri = self::getBrandLogoDataUri();

        $updates = [];

        foreach (['id', 'en'] as $lang) {
            $urlColumn = self::URL_COLUMN[$lang];

            // Idempotent PER BAHASA: kalau cuma versi EN yang belum ada
            // (mis. proyek lama yang baru di-upgrade fitur ini), cukup
            // buatkan yang EN saja, jangan timpa versi ID yang sudah bagus.
            if (!$force && !empty($buku->{$urlColumn})) {
                continue;
            }

            $slug = Str::slug($buku->judul_buku) ?: 'buku';
            $filename = "{$slug}-{$buku->id}-{$lang}.pdf";
            $storagePath = "buku-pdf/{$filename}";

            $labels = self::labels($lang);
            $chapters = self::buildChapters($buku, $kategoriNama, $lang, $labels);
            $totalHalaman = count($chapters) + 3; // cover + sinopsis + N bab + penutup

            $pdf = Pdf::loadView('pdf.sample-reading', [
                'buku' => $buku,
                'lang' => $lang,
                'labels' => $labels,
                'kategoriNama' => self::categoryLabel($kategoriNama, $lang),
                'bahasaTampil' => self::bahasaLabel($buku->bahasa, $lang),
                'chapters' => $chapters,
                'totalHalamanSample' => $totalHalaman,
                // FIX BUG (cover PDF pakai gambar buku asli): dompdf punya
                // 'enable_remote' = false secara default (demi keamanan,
                // cegah SSRF), jadi <img src="https://..."> TIDAK akan
                // dimuat begitu saja. Solusinya: kita unduh byte gambarnya
                // sendiri di sisi server (timeout singkat & try/catch
                // penuh), lalu suntikkan sebagai data URI base64 — dompdf
                // selalu bisa merender data URI karena dianggap "lokal".
                // Kalau unduhan gagal (404, DNS mati, timeout, dst),
                // coverDataUri bernilai null dan template pakai fallback.
                'coverDataUri' => $coverDataUri,
                // FIX BUG (logo cover PDF beda dengan favicon tab browser):
                // dibaca langsung dari public/icon-192.png — sama persis
                // dengan <link rel="icon"> di app.blade.php — dijamin
                // identik pixel-per-pixel, bukan digambar ulang terpisah.
                'logoDataUri' => $logoDataUri,
            ])->setPaper('a5', 'portrait');

            // ->save() dengan disk 'public' otomatis menulis ke
            // storage/app/public/buku-pdf/{filename} — sama seperti cara
            // AdminBukuController::uploadPdf() menyimpan file upload manual.
            $pdf->save($storagePath, 'public');

            // PENTING: pakai Storage::url() TANPA disk eksplisit (bukan
            // Storage::disk('public')->url()) supaya hasilnya sama persis
            // dengan AdminBukuController::uploadPdf(): path relatif
            // "/storage/buku-pdf/xxx.pdf", bukan URL absolut ber-host.
            $url = Storage::url($storagePath);

            $updates[$urlColumn] = $url;
            $result[$lang] = $url;
        }

        if (!empty($updates)) {
            $buku->forceFill($updates)->save();
        }

        return $result;
    }

    /**
     * Unduh gambar cover eksternal (openlibrary.org, archive.org, dst) dan
     * kembalikan sebagai data URI base64 siap pakai di <img src="...">.
     *
     * SENGAJA sangat defensif: buku ini boleh gagal generate PDF-nya kalau
     * banyak; tapi gambar cover TIDAK BOLEH sampai menghentikan seluruh
     * proses seeding/generate hanya karena satu URL gambar mati/timeout/
     * DNS error (mis. ERR_NAME_NOT_RESOLVED saat server offline). Setiap
     * jenis kegagalan ditangkap dan cukup menghasilkan null (-> fallback).
     */
    private static function fetchCoverAsDataUri(?string $coverUrl): ?string
    {
        if (empty($coverUrl) || !preg_match('/^https?:\/\//i', $coverUrl)) {
            return null;
        }

        try {
            $response = Http::timeout(self::COVER_FETCH_TIMEOUT)
                ->retry(1, 200)
                ->get($coverUrl);

            if (!$response->successful()) {
                return null;
            }

            $bytes = $response->body();
            $mime = $response->header('Content-Type') ?: 'image/jpeg';

            // Pastikan benar-benar gambar (bukan halaman error HTML yang
            // kebetulan dibalas dengan status 200), supaya tidak menyuntik
            // konten rusak ke PDF.
            if (!str_starts_with($mime, 'image/') || @getimagesizefromstring($bytes) === false) {
                return null;
            }

            return 'data:' . $mime . ';base64,' . base64_encode($bytes);
        } catch (\Throwable $e) {
            // Mencakup semua kegagalan jaringan: DNS tidak resolve
            // (ERR_NAME_NOT_RESOLVED saat offline), connection refused,
            // timeout, SSL error, dst. Tidak melempar ulang — cover
            // hanyalah bonus visual, bukan bagian kritikal PDF.
            Log::warning('SampleBookPdfGenerator: gagal unduh cover, pakai fallback.', [
                'cover_url' => $coverUrl,
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /** Cache in-memory supaya file favicon cuma dibaca sekali per request/proses, walau dipanggil untuk puluhan buku sekaligus (mis. saat seeding). */
    private static ?string $logoDataUriCache = null;

    /**
     * Baca favicon PNG asli aplikasi (public/icon-192.png) dan kembalikan
     * sebagai data URI base64 untuk logo di cover PDF — sumbernya SAMA
     * PERSIS dengan yang dipakai <link rel="icon"> di app.blade.php, jadi
     * dijamin identik dengan ikon di tab browser.
     */
    private static function getBrandLogoDataUri(): ?string
    {
        if (self::$logoDataUriCache !== null) {
            return self::$logoDataUriCache;
        }

        $path = public_path('icon-192.png');

        if (!file_exists($path)) {
            Log::warning('SampleBookPdfGenerator: favicon public/icon-192.png tidak ditemukan, cover PDF tampil tanpa logo.');
            return self::$logoDataUriCache = null;
        }

        $bytes = @file_get_contents($path);
        if ($bytes === false) {
            return self::$logoDataUriCache = null;
        }

        return self::$logoDataUriCache = 'data:image/png;base64,' . base64_encode($bytes);
    }

    /**
     * Label statis untuk chrome PDF (bukan isi bacaan) — judul bagian,
     * label info box, footer, dsb. Terpisah dari kamus i18n React
     * (LanguageContext.jsx) karena Blade/dompdf tidak bisa mengakses
     * kamus JS itu; ini padanan versi PHP-nya, khusus untuk PDF.
     */
    private static function labels(string $lang): array
    {
        if ($lang === 'en') {
            return [
                'docTitleSuffix' => 'Reading Preview',
                'brandRibbon' => 'Sample Preview',
                'synopsis' => 'Synopsis',
                'author' => 'Author',
                'publisher' => 'Publisher',
                'category' => 'Category',
                'language' => 'Language',
                'pageCount' => 'Page Count (print edition)',
                'isbn' => 'ISBN',
                'chapter' => 'Chapter',
                'pageFooter' => 'Page :n of :total • Z-Lib Preview — not the complete original text',
                'chapterIntro' => 'The following :category-themed excerpt is provided as a mood-setting introduction before you continue to ":title" by :author.',
                'endOfPreview' => 'End of Preview',
                'closingText' => 'You\'ve just read an early excerpt from :title.',
                'closingCta' => 'To keep reading this book in full, please request it for loan via the Catalog > Request Loan menu, or visit the library circulation desk.',
                'by' => 'by',
            ];
        }

        return [
            'docTitleSuffix' => 'Pratinjau Baca',
            'brandRibbon' => 'Pratinjau Baca',
            'synopsis' => 'Sinopsis',
            'author' => 'Penulis',
            'publisher' => 'Penerbit',
            'category' => 'Kategori',
            'language' => 'Bahasa',
            'pageCount' => 'Jumlah Halaman (edisi cetak)',
            'isbn' => 'ISBN',
            'chapter' => 'Bab',
            'pageFooter' => 'Halaman :n dari :total • Pratinjau Z-Lib — bukan teks lengkap buku asli',
            'chapterIntro' => 'Bacaan bertema :category berikut disiapkan sebagai pengantar suasana sebelum Anda melanjutkan ke ":title" karya :author.',
            'endOfPreview' => 'Akhir dari Pratinjau',
            'closingText' => 'Anda baru saja membaca cuplikan awal dari :title.',
            'closingCta' => 'Untuk melanjutkan membaca buku ini secara utuh, silakan ajukan peminjaman melalui menu Katalog > Ajukan Peminjaman, atau kunjungi meja sirkulasi perpustakaan.',
            'by' => 'oleh',
        ];
    }

    /**
     * Terjemahkan NILAI kolom `bahasa` (fakta asli tentang buku, mis.
     * "Indonesia" untuk Laskar Pelangi, "Inggris" untuk Harry Potter) untuk
     * ditampilkan di versi PDF EN — mis. "Indonesia" -> "Indonesian".
     *
     * PENTING: ini BEDA dengan bahasa PDF-nya sendiri (parameter $lang).
     * Contoh nyata kenapa ini harus dipisah: Laskar Pelangi punya
     * bahasa='Indonesia' di database (fakta: bukunya memang ditulis dalam
     * Bahasa Indonesia). Kalau pembaca membuka PREVIEW versi EN buku itu,
     * baris "Language" di info-box TETAP harus menampilkan "Indonesian"
     * (fakta asli soal bukunya), BUKAN "English" — walau teks pratinjau
     * yang sedang mereka baca saat itu kebetulan berbahasa Inggris.
     */
    private static function bahasaLabel(?string $bahasaAsli, string $lang): string
    {
        if (empty($bahasaAsli)) {
            return '-';
        }

        if ($lang !== 'en') {
            return $bahasaAsli;
        }

        $map = [
            'Indonesia' => 'Indonesian',
            'Inggris' => 'English',
        ];

        return $map[$bahasaAsli] ?? $bahasaAsli;
    }

    /**
     * Terjemahkan NAMA TAMPILAN kategori untuk versi EN (mis. "Fiksi" ->
     * "Fiction"). Kategori di DATABASE tetap disimpan dalam Bahasa
     * Indonesia (dipakai sebagai KEY lookup ke SampleReadingContent) —
     * ini murni lapisan tampilan untuk PDF versi Inggris.
     */
    private static function categoryLabel(string $kategoriNama, string $lang): string
    {
        if ($lang !== 'en') {
            return $kategoriNama;
        }

        $map = [
            'Fiksi' => 'Fiction',
            'Non-Fiksi' => 'Non-Fiction',
            'Teknologi & Komputer' => 'Technology & Computers',
            'Sains' => 'Science',
            'Sejarah' => 'History',
            'Biografi & Memoar' => 'Biography & Memoir',
            'Pengembangan Diri' => 'Self-Development',
            'Bisnis & Ekonomi' => 'Business & Economics',
            'Agama & Spiritual' => 'Religion & Spirituality',
            'Anak & Remaja' => 'Children & Young Adult',
            'Komik & Graphic Novel' => 'Comics & Graphic Novels',
            'Kesehatan & Gaya Hidup' => 'Health & Lifestyle',
        ];

        return $map[$kategoriNama] ?? $kategoriNama;
    }

    /**
     * Bangun konten bab dari SampleReadingContent (tulisan original per
     * kategori, tersedia dalam 2 bahasa), BUKAN Lorem Ipsum.
     *
     * Setiap kategori punya 2 varian (A/B) berisi 4 paragraf. Varian
     * dipilih deterministik dari ID buku (genap/ganjil), supaya:
     *  - Buku yang sama SELALU dapat varian yang sama tiap kali di-generate
     *    ulang (tidak berubah-ubah acak setiap --force), DAN sama antara
     *    versi ID & EN-nya (paragraf ke-N versi id berpasangan makna
     *    dengan paragraf ke-N versi en).
     *  - Buku-buku dalam kategori yang sama tidak semuanya identik —
     *    kira-kira separuh dapat varian A, separuh dapat varian B.
     *
     * Paragraf pertama diberi kalimat pembuka yang menyebut judul & penulis
     * ASLI buku ini (fakta publik, bukan konten berhak cipta) supaya
     * pratinjau terasa dipersiapkan khusus untuk buku tersebut.
     */
    private static function buildChapters(Buku $buku, string $kategoriNamaAsli, string $lang, array $labels): array
    {
        $contentMap = SampleReadingContent::all($lang);

        // Fallback ke 'Non-Fiksi' kalau kategori buku ini kosong ('-') atau
        // namanya tidak persis cocok dengan salah satu dari 12 kategori
        // baku (mis. kategori kustom yang ditambah admin belakangan).
        // NB: lookup SELALU pakai nama kategori ASLI (Indonesia) karena
        // itulah key yang dipakai SampleReadingContent, terlepas dari
        // bahasa PDF yang sedang dibuat.
        $variants = $contentMap[$kategoriNamaAsli] ?? $contentMap['Non-Fiksi'];

        // Seed SAMA untuk kedua bahasa (tidak ikut $lang) supaya varian
        // yang dipilih selalu berpasangan makna antara versi id & en.
        $seed = $buku->id ?: crc32($buku->judul_buku);
        $variantIndex = $seed % count($variants); // 0 atau 1
        $paragraphs = $variants[$variantIndex];

        $kategoriTampil = self::categoryLabel($kategoriNamaAsli, $lang);

        $chapters = [];
        foreach ($paragraphs as $i => $paragraph) {
            $nomor = $i + 1;
            $isFirst = $i === 0;

            $chapters[] = [
                'nomor' => $nomor,
                'judul' => $labels['chapter'] . " {$nomor}",
                // Catatan pembuka HANYA di bab pertama, supaya tidak
                // berulang-ulang mengganggu di tiap halaman.
                'catatanPembuka' => $isFirst
                    ? strtr($labels['chapterIntro'], [
                        ':category' => $kategoriTampil,
                        ':title' => $buku->judul_buku,
                        ':author' => $buku->penulis,
                    ])
                    : null,
                'paragraphs' => [$paragraph],
            ];
        }

        return $chapters;
    }
}
