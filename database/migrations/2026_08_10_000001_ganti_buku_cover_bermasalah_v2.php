<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * v2 dari perbaikan sebelumnya — kali ini matching pakai `judul_buku`
     * (bukan isbn) supaya PASTI ketemu row-nya, apapun ISBN yang sekarang
     * tersimpan / apapun migration sebelumnya sudah jalan atau belum.
     * judul_buku aman dipakai sebagai kunci karena tidak pernah diubah
     * oleh migration manapun sebelum ini.
     */
    public function up(): void
    {
        $penggantian = [
            'Ayat-Ayat Cinta' => [
                'judul_buku' => 'The Prophet',
                'penulis' => 'Kahlil Gibran',
                'penerbit' => 'Alfred A. Knopf',
                'tahun_terbit' => 1923,
                'isbn' => '9780394404288',
                'bahasa' => 'Inggris',
                'deskripsi' => 'Kumpulan esai puitis tentang cinta, pernikahan, pekerjaan, dan makna hidup dari salah satu karya spiritual paling berpengaruh abad ke-20.',
            ],
            'Cantik Itu Luka' => [
                'judul_buku' => 'Pride and Prejudice',
                'penulis' => 'Jane Austen',
                'penerbit' => 'Penguin Classics',
                'tahun_terbit' => 1813,
                'isbn' => '9780141439518',
                'bahasa' => 'Inggris',
                'deskripsi' => 'Kisah cinta klasik Elizabeth Bennet dan Mr. Darcy yang penuh kecerdasan, ironi, dan kritik sosial terhadap masyarakat Inggris abad ke-19.',
            ],
            'Filosofi Teras' => [
                'judul_buku' => 'How to Win Friends and Influence People',
                'penulis' => 'Dale Carnegie',
                'penerbit' => 'Pocket Books',
                'tahun_terbit' => 1936,
                'isbn' => '9780671027032',
                'bahasa' => 'Inggris',
                'deskripsi' => 'Panduan klasik tentang membangun relasi, memengaruhi orang lain secara positif, dan berkomunikasi secara efektif.',
            ],
            'Negeri 5 Menara' => [
                'judul_buku' => 'The Catcher in the Rye',
                'penulis' => 'J.D. Salinger',
                'penerbit' => 'Little, Brown and Company',
                'tahun_terbit' => 1951,
                'isbn' => '9780316769488',
                'bahasa' => 'Inggris',
                'deskripsi' => 'Kisah Holden Caulfield, remaja yang gelisah dan sinis, mengarungi beberapa hari penuh gejolak di New York.',
            ],
            'Perahu Kertas' => [
                'judul_buku' => 'Animal Farm',
                'penulis' => 'George Orwell',
                'penerbit' => 'Signet Classics',
                'tahun_terbit' => 1945,
                'isbn' => '9780451526342',
                'bahasa' => 'Inggris',
                'deskripsi' => 'Fabel satir tentang sekelompok hewan ternak yang menggulingkan pemiliknya, lalu perlahan membangun sistem kekuasaan baru yang menindas.',
            ],
        ];

        foreach ($penggantian as $judulLama => $data) {
            DB::table('buku')
                ->where('judul_buku', $judulLama)
                ->update(array_merge($data, [
                    'cover_url' => "https://covers.openlibrary.org/b/isbn/{$data['isbn']}-L.jpg",
                    'updated_at' => now(),
                ]));
        }
    }

    public function down(): void
    {
        //
    }
};
