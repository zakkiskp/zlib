<?php

namespace Database\Seeders;

use App\Models\Buku;
use App\Models\KategoriBuku;
use App\Models\Rak;
use App\Models\User;
use App\Services\SampleBookPdfGenerator;
use Illuminate\Database\Seeder;

class BukuSeeder extends Seeder
{
    /**
     * cover_url memakai Open Library Covers API: https://covers.openlibrary.org/b/isbn/{ISBN}-L.jpg
     *
     * v4: Ayat-Ayat Cinta, Cantik Itu Luka, Filosofi Teras, Negeri 5 Menara, dan
     * Perahu Kertas DIGANTI TOTAL (bukan cuma ganti ISBN lagi) — 2 percobaan
     * sebelumnya menemukan bahwa edisi Indonesia buku-buku ini konsisten tidak
     * terindex covernya di Open Library. Diganti ke judul lain yang cover-nya
     * sudah dipastikan tersedia. (Kalau project sudah pernah di-seed sebelumnya,
     * pakai migration `2026_08_09_000002_ganti_buku_cover_bermasalah` supaya
     * tidak perlu reseed ulang dari nol.)
     *
     * kategori di-attach() lewat relasi many-to-many kategori_buku_relasi
     * (setiap buku minimal dapat 1 kategori, admin bisa tambah lebih lewat panel nanti).
     *
     * v5: FIX BUG (fitur Baca Online selalu "File PDF belum diunggah"):
     * setiap buku sekarang otomatis dibuatkan PDF "Pratinjau Baca" lewat
     * SampleBookPdfGenerator (lihat class itu untuk penjelasan lengkap
     * kenapa isinya placeholder, bukan teks asli buku yang berhak cipta).
     * Kalau project sudah pernah di-seed sebelumnya dan tidak ingin
     * reseed dari nol, jalankan saja secara terpisah:
     *   php artisan buku:generate-sample-pdfs
     */
    public function run(): void
    {
        $kategoriMap = KategoriBuku::pluck('id', 'nama_kategori');
        $rakIds = Rak::pluck('id')->toArray();
        $adminId = User::where('role', 'admin')->value('id') ?? 1;

        $penerbitIndonesia = [
            'Bentang Pustaka',
            'Gramedia Pustaka Utama',
            'Kompas',
            'Republika',
            'Lentera Dipantara',
        ];

        $bukuList = [
            // ================= FIKSI =================
            ['judul' => 'Laskar Pelangi', 'penulis' => 'Andrea Hirata', 'penerbit' => 'Bentang Pustaka', 'tahun' => 2005, 'isbn' => '9789793062792', 'kategori' => 'Fiksi', 'deskripsi' => 'Kisah perjuangan sepuluh anak dari keluarga kurang mampu di Belitung yang menempuh pendidikan dengan segala keterbatasan, namun tetap gigih mengejar cita-cita.'],
            ['judul' => 'Sang Pemimpi', 'penulis' => 'Andrea Hirata', 'penerbit' => 'Bentang Pustaka', 'tahun' => 2006, 'isbn' => '9789793062921', 'kategori' => 'Fiksi', 'deskripsi' => 'Lanjutan kisah Ikal bersama sahabatnya Arai yang bermimpi melanjutkan pendidikan hingga ke Eropa, dibalut semangat persahabatan dan kerja keras.'],
            ['judul' => 'Pride and Prejudice', 'penulis' => 'Jane Austen', 'penerbit' => 'Penguin Classics', 'tahun' => 1813, 'isbn' => '9780141439518', 'kategori' => 'Fiksi', 'deskripsi' => 'Kisah cinta klasik Elizabeth Bennet dan Mr. Darcy yang penuh kecerdasan, ironi, dan kritik sosial terhadap masyarakat Inggris abad ke-19.'],
            ['judul' => 'The Catcher in the Rye', 'penulis' => 'J.D. Salinger', 'penerbit' => 'Little, Brown and Company', 'tahun' => 1951, 'isbn' => '9780316769488', 'kategori' => 'Fiksi', 'deskripsi' => 'Kisah Holden Caulfield, remaja yang gelisah dan sinis, mengarungi beberapa hari penuh gejolak di New York.'],
            ['judul' => 'Animal Farm', 'penulis' => 'George Orwell', 'penerbit' => 'Signet Classics', 'tahun' => 1945, 'isbn' => '9780451526342', 'kategori' => 'Fiksi', 'deskripsi' => 'Fabel satir tentang sekelompok hewan ternak yang menggulingkan pemiliknya, lalu perlahan membangun sistem kekuasaan baru yang menindas.'],
            ['judul' => "Harry Potter and the Philosopher's Stone", 'penulis' => 'J.K. Rowling', 'penerbit' => 'Bloomsbury', 'tahun' => 1997, 'isbn' => '9780747532699', 'kategori' => 'Fiksi', 'deskripsi' => 'Awal petualangan Harry Potter menemukan jati dirinya sebagai penyihir dan memasuki dunia sihir di Hogwarts.'],
            ['judul' => 'Harry Potter and the Chamber of Secrets', 'penulis' => 'J.K. Rowling', 'penerbit' => 'Bloomsbury', 'tahun' => 1998, 'isbn' => '9780747538493', 'kategori' => 'Fiksi', 'deskripsi' => 'Harry kembali ke Hogwarts dan harus memecahkan misteri Kamar Rahasia yang mengancam keselamatan murid berdarah campuran.'],
            ['judul' => 'To Kill a Mockingbird', 'penulis' => 'Harper Lee', 'penerbit' => 'J.B. Lippincott & Co.', 'tahun' => 1960, 'isbn' => '9780061120084', 'kategori' => 'Fiksi', 'deskripsi' => 'Kisah tumbuh dewasa Scout Finch di kota kecil Alabama yang bergulat dengan isu rasial melalui sudut pandang ayahnya, seorang pengacara berintegritas.'],
            ['judul' => '1984', 'penulis' => 'George Orwell', 'penerbit' => 'Secker & Warburg', 'tahun' => 1949, 'isbn' => '9780451524935', 'kategori' => 'Fiksi', 'deskripsi' => 'Distopia klasik tentang negara totaliter yang mengawasi setiap gerak-gerik warganya melalui sosok Big Brother.'],
            ['judul' => 'The Great Gatsby', 'penulis' => 'F. Scott Fitzgerald', 'penerbit' => "Charles Scribner's Sons", 'tahun' => 1925, 'isbn' => '9780743273565', 'kategori' => 'Fiksi', 'deskripsi' => 'Potret kemewahan dan kekosongan American Dream melalui kisah cinta Jay Gatsby yang misterius.'],
            ['judul' => 'The Alchemist', 'penulis' => 'Paulo Coelho', 'penerbit' => 'HarperOne', 'tahun' => 1988, 'isbn' => '9780061122415', 'kategori' => 'Fiksi', 'deskripsi' => 'Perjalanan spiritual seorang gembala muda bernama Santiago dalam mengejar takdir pribadinya melintasi gurun Sahara.'],
            ['judul' => 'The Hobbit', 'penulis' => 'J.R.R. Tolkien', 'penerbit' => 'George Allen & Unwin', 'tahun' => 1937, 'isbn' => '9780547928227', 'kategori' => 'Fiksi', 'deskripsi' => 'Petualangan tak terduga Bilbo Baggins bersama para kurcaci dan penyihir Gandalf untuk merebut kembali harta dari sang naga Smaug.'],
            ['judul' => 'Dune', 'penulis' => 'Frank Herbert', 'penerbit' => 'Chilton Books', 'tahun' => 1965, 'isbn' => '9780441172719', 'kategori' => 'Fiksi', 'deskripsi' => 'Epik fiksi ilmiah tentang perebutan kekuasaan di planet gurun Arrakis, satu-satunya sumber rempah paling berharga di alam semesta.'],
            ['judul' => 'The Da Vinci Code', 'penulis' => 'Dan Brown', 'penerbit' => 'Doubleday', 'tahun' => 2003, 'isbn' => '9780307474278', 'kategori' => 'Fiksi', 'deskripsi' => 'Thriller misteri seputar simbolisme religius dan konspirasi tersembunyi yang mengungkap rahasia besar sejarah Eropa.'],

            // ================= NON-FIKSI =================
            ['judul' => 'Sapiens: A Brief History of Humankind', 'penulis' => 'Yuval Noah Harari', 'penerbit' => 'Harper', 'tahun' => 2015, 'isbn' => '9780062316097', 'kategori' => 'Non-Fiksi', 'deskripsi' => 'Menelusuri perjalanan evolusi manusia dari zaman batu hingga era revolusi kognitif, pertanian, dan sains.'],
            ['judul' => 'Guns, Germs, and Steel', 'penulis' => 'Jared Diamond', 'penerbit' => 'W. W. Norton & Company', 'tahun' => 1997, 'isbn' => '9780393317558', 'kategori' => 'Non-Fiksi', 'deskripsi' => 'Analisis mendalam tentang mengapa peradaban di berbagai belahan dunia berkembang dengan kecepatan yang berbeda-beda.'],
            ['judul' => "Man's Search for Meaning", 'penulis' => 'Viktor E. Frankl', 'penerbit' => 'Beacon Press', 'tahun' => 1946, 'isbn' => '9780807014295', 'kategori' => 'Non-Fiksi', 'deskripsi' => 'Refleksi mendalam seorang psikiater tentang pencarian makna hidup di tengah penderitaan kamp konsentrasi Nazi.'],

            // ================= TEKNOLOGI & KOMPUTER =================
            ['judul' => 'Clean Code', 'penulis' => 'Robert C. Martin', 'penerbit' => 'Prentice Hall', 'tahun' => 2008, 'isbn' => '9780132350884', 'kategori' => 'Teknologi & Komputer', 'deskripsi' => 'Panduan praktis menulis kode program yang bersih, mudah dibaca, dan mudah dirawat bagi para pengembang perangkat lunak.'],
            ['judul' => 'The Pragmatic Programmer', 'penulis' => 'Andrew Hunt & David Thomas', 'penerbit' => 'Addison-Wesley', 'tahun' => 1999, 'isbn' => '9780201616224', 'kategori' => 'Teknologi & Komputer', 'deskripsi' => 'Kumpulan tips dan filosofi praktis untuk menjadi programmer yang lebih efektif dan profesional.'],
            ['judul' => 'Introduction to Algorithms', 'penulis' => 'Cormen, Leiserson, Rivest, Stein', 'penerbit' => 'MIT Press', 'tahun' => 2009, 'isbn' => '9780262033848', 'kategori' => 'Teknologi & Komputer', 'deskripsi' => 'Buku rujukan utama tentang struktur data dan algoritma yang dipakai luas di dunia akademik maupun industri.'],

            // ================= SAINS =================
            ['judul' => 'Thinking, Fast and Slow', 'penulis' => 'Daniel Kahneman', 'penerbit' => 'Farrar, Straus and Giroux', 'tahun' => 2011, 'isbn' => '9780374533557', 'kategori' => 'Sains', 'deskripsi' => 'Eksplorasi dua sistem berpikir manusia — yang cepat & intuitif, serta yang lambat & rasional — dalam pengambilan keputusan.'],
            ['judul' => 'A Brief History of Time', 'penulis' => 'Stephen Hawking', 'penerbit' => 'Bantam Books', 'tahun' => 1988, 'isbn' => '9780553380163', 'kategori' => 'Sains', 'deskripsi' => 'Penjelasan populer tentang kosmologi, lubang hitam, dan asal-usul alam semesta oleh salah satu fisikawan terbesar abad ini.'],
            ['judul' => 'Cosmos', 'penulis' => 'Carl Sagan', 'penerbit' => 'Random House', 'tahun' => 1980, 'isbn' => '9780345539434', 'kategori' => 'Sains', 'deskripsi' => 'Perjalanan memukau menjelajahi alam semesta, sejarah sains, dan tempat manusia di dalamnya.'],

            // ================= SEJARAH =================
            ['judul' => 'Bumi Manusia', 'penulis' => 'Pramoedya Ananta Toer', 'penerbit' => 'Lentera Dipantara', 'tahun' => 2005, 'isbn' => '9789799731234', 'kategori' => 'Sejarah', 'deskripsi' => 'Novel sejarah tentang Minke, pemuda pribumi di masa kolonial Hindia Belanda yang bergulat dengan cinta, ilmu, dan penindasan.'],

            // ================= BIOGRAFI & MEMOAR =================
            ['judul' => 'Steve Jobs', 'penulis' => 'Walter Isaacson', 'penerbit' => 'Simon & Schuster', 'tahun' => 2011, 'isbn' => '9781451648539', 'kategori' => 'Biografi & Memoar', 'deskripsi' => 'Biografi resmi pendiri Apple yang mengungkap sisi visioner sekaligus kompleks dari Steve Jobs.'],
            ['judul' => 'Educated', 'penulis' => 'Tara Westover', 'penerbit' => 'Random House', 'tahun' => 2018, 'isbn' => '9780399590504', 'kategori' => 'Biografi & Memoar', 'deskripsi' => 'Memoar seorang perempuan yang tumbuh tanpa pendidikan formal namun akhirnya meraih gelar doktor dari Cambridge.'],
            ['judul' => 'Long Walk to Freedom', 'penulis' => 'Nelson Mandela', 'penerbit' => 'Little, Brown and Company', 'tahun' => 1994, 'isbn' => '9780316548182', 'kategori' => 'Biografi & Memoar', 'deskripsi' => 'Autobiografi Nelson Mandela tentang perjuangan panjangnya melawan apartheid hingga menjadi presiden Afrika Selatan.'],

            // ================= PENGEMBANGAN DIRI =================
            ['judul' => 'How to Win Friends and Influence People', 'penulis' => 'Dale Carnegie', 'penerbit' => 'Pocket Books', 'tahun' => 1936, 'isbn' => '9780671027032', 'kategori' => 'Pengembangan Diri', 'deskripsi' => 'Panduan klasik tentang membangun relasi, memengaruhi orang lain secara positif, dan berkomunikasi secara efektif.'],
            ['judul' => 'Atomic Habits', 'penulis' => 'James Clear', 'penerbit' => 'Avery', 'tahun' => 2018, 'isbn' => '9780735211292', 'kategori' => 'Pengembangan Diri', 'deskripsi' => 'Strategi membangun kebiasaan baik dan menghilangkan kebiasaan buruk melalui perubahan-perubahan kecil yang konsisten.'],
            ['judul' => 'The 7 Habits of Highly Effective People', 'penulis' => 'Stephen R. Covey', 'penerbit' => 'Free Press', 'tahun' => 1989, 'isbn' => '9780743269513', 'kategori' => 'Pengembangan Diri', 'deskripsi' => 'Tujuh prinsip fundamental untuk membangun efektivitas pribadi dan profesional secara menyeluruh.'],
            ['judul' => 'The Subtle Art of Not Giving a F*ck', 'penulis' => 'Mark Manson', 'penerbit' => 'Harper', 'tahun' => 2016, 'isbn' => '9780062457714', 'kategori' => 'Pengembangan Diri', 'deskripsi' => 'Pendekatan jujur dan anti-mainstream tentang cara memilih hal yang benar-benar layak diperjuangkan dalam hidup.'],

            // ================= BISNIS & EKONOMI =================
            ['judul' => 'The Psychology of Money', 'penulis' => 'Morgan Housel', 'penerbit' => 'Harriman House', 'tahun' => 2020, 'isbn' => '9780857197689', 'kategori' => 'Bisnis & Ekonomi', 'deskripsi' => 'Kumpulan pelajaran tentang perilaku manusia terhadap uang, yang seringkali lebih penting daripada sekadar kecerdasan finansial.'],
            ['judul' => 'Rich Dad Poor Dad', 'penulis' => 'Robert T. Kiyosaki', 'penerbit' => 'Plata Publishing', 'tahun' => 1997, 'isbn' => '9781612680194', 'kategori' => 'Bisnis & Ekonomi', 'deskripsi' => 'Perbandingan pola pikir finansial dua sosok ayah yang mengubah cara pandang penulis terhadap uang dan investasi.'],
            ['judul' => 'Good to Great', 'penulis' => 'Jim Collins', 'penerbit' => 'HarperBusiness', 'tahun' => 2001, 'isbn' => '9780066620992', 'kategori' => 'Bisnis & Ekonomi', 'deskripsi' => 'Riset mendalam tentang faktor-faktor yang membuat perusahaan biasa bertransformasi menjadi perusahaan besar.'],
            ['judul' => 'The Lean Startup', 'penulis' => 'Eric Ries', 'penerbit' => 'Crown Business', 'tahun' => 2011, 'isbn' => '9780307887894', 'kategori' => 'Bisnis & Ekonomi', 'deskripsi' => 'Metodologi membangun startup secara efisien melalui siklus validated learning dan iterasi produk yang cepat.'],

            // ================= AGAMA & SPIRITUAL =================
            ['judul' => 'The Prophet', 'penulis' => 'Kahlil Gibran', 'penerbit' => 'Alfred A. Knopf', 'tahun' => 1923, 'isbn' => '9780394404288', 'kategori' => 'Agama & Spiritual', 'deskripsi' => 'Kumpulan esai puitis tentang cinta, pernikahan, pekerjaan, dan makna hidup dari salah satu karya spiritual paling berpengaruh abad ke-20.'],

            // ================= ANAK & REMAJA =================
            ["judul" => "Charlotte's Web", 'penulis' => 'E.B. White', 'penerbit' => 'Harper & Brothers', 'tahun' => 1952, 'isbn' => '9780064400558', 'kategori' => 'Anak & Remaja', 'deskripsi' => 'Kisah persahabatan hangat antara seekor babi bernama Wilbur dan laba-laba bijaksana bernama Charlotte.'],
            ['judul' => 'Diary of a Wimpy Kid', 'penulis' => 'Jeff Kinney', 'penerbit' => 'Amulet Books', 'tahun' => 2007, 'isbn' => '9780810993136', 'kategori' => 'Anak & Remaja', 'deskripsi' => 'Catatan harian jenaka seorang anak sekolah menengah bernama Greg Heffley yang penuh kekonyolan sehari-hari.'],
            ['judul' => 'Percy Jackson & the Olympians: The Lightning Thief', 'penulis' => 'Rick Riordan', 'penerbit' => 'Disney-Hyperion', 'tahun' => 2005, 'isbn' => '9780786838653', 'kategori' => 'Anak & Remaja', 'deskripsi' => 'Petualangan seorang remaja yang ternyata putra dewa Poseidon dalam dunia mitologi Yunani versi modern.'],

            // ================= KOMIK & GRAPHIC NOVEL =================
            ['judul' => 'Naruto Vol. 1', 'penulis' => 'Masashi Kishimoto', 'penerbit' => 'VIZ Media', 'tahun' => 2003, 'isbn' => '9781569319000', 'kategori' => 'Komik & Graphic Novel', 'deskripsi' => 'Awal kisah Naruto Uzumaki, ninja muda yang bermimpi menjadi Hokage meski dijauhi oleh penduduk desanya.'],
            ['judul' => 'One Piece Vol. 1', 'penulis' => 'Eiichiro Oda', 'penerbit' => 'VIZ Media', 'tahun' => 2003, 'isbn' => '9781569319017', 'kategori' => 'Komik & Graphic Novel', 'deskripsi' => 'Petualangan Monkey D. Luffy dan kru bajak lautnya dalam mengejar harta karun legendaris One Piece.'],

            // ================= KESEHATAN & GAYA HIDUP =================
            ['judul' => 'Ikigai: The Japanese Secret to a Long and Happy Life', 'penulis' => 'Héctor García & Francesc Miralles', 'penerbit' => 'Penguin', 'tahun' => 2016, 'isbn' => '9780143130727', 'kategori' => 'Kesehatan & Gaya Hidup', 'deskripsi' => 'Rahasia hidup panjang dan bahagia ala masyarakat Okinawa, Jepang, lewat konsep menemukan alasan untuk bangun setiap pagi.'],
            ['judul' => 'Why We Sleep', 'penulis' => 'Matthew Walker', 'penerbit' => 'Scribner', 'tahun' => 2017, 'isbn' => '9781501144325', 'kategori' => 'Kesehatan & Gaya Hidup', 'deskripsi' => 'Ulasan ilmiah tentang pentingnya tidur bagi kesehatan fisik, mental, dan produktivitas manusia.'],
            ['judul' => 'The Body Keeps the Score', 'penulis' => 'Bessel van der Kolk', 'penerbit' => 'Viking', 'tahun' => 2014, 'isbn' => '9780670785933', 'kategori' => 'Kesehatan & Gaya Hidup', 'deskripsi' => 'Penjelasan mendalam tentang bagaimana trauma memengaruhi tubuh dan pikiran, serta jalan menuju pemulihan.'],
        ];

        foreach ($bukuList as $item) {
            $totalStok = random_int(3, 12);
            $stokTersedia = random_int(0, $totalStok);

            $buku = Buku::create([
                'judul_buku' => $item['judul'],
                'penulis' => $item['penulis'],
                'penerbit' => $item['penerbit'],
                'tahun_terbit' => $item['tahun'],
                'isbn' => $item['isbn'],
                'rak_id' => $rakIds[array_rand($rakIds)],
                'deskripsi' => $item['deskripsi'],
                'cover_url' => "https://covers.openlibrary.org/b/isbn/{$item['isbn']}-L.jpg",
                'file_pdf_url' => null,
                'bahasa' => in_array($item['penerbit'], $penerbitIndonesia, true) ? 'Indonesia' : 'Inggris',
                'jumlah_halaman' => random_int(150, 550),
                'stok_tersedia' => $stokTersedia,
                'total_stok' => $totalStok,
                'rating_rata_rata' => round(random_int(35, 50) / 10, 1),
                'jumlah_ulasan' => random_int(0, 45),
                'kondisi' => 'baik',
                'created_by' => $adminId,
            ]);

            $kategoriId = $kategoriMap[$item['kategori']] ?? $kategoriMap->first();
            $buku->kategoris()->attach($kategoriId);

            // FIX BUG (Baca Online selalu "belum diunggah"): langsung isi
            // file_pdf_url dengan PDF pratinjau otomatis saat seeding,
            // supaya begitu selesai `db:seed` semua 38 buku sudah bisa
            // langsung dibuka di PDF Reader tanpa langkah tambahan.
            SampleBookPdfGenerator::generate($buku);
        }
    }
}
