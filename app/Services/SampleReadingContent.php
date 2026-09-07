<?php

namespace App\Services;

/**
 * Konten bacaan ORIGINAL untuk PDF "Pratinjau Baca" Z-Lib, dikelompokkan
 * per kategori buku (bukan per judul buku spesifik), dan tersedia dalam
 * 2 bahasa (id/en) supaya isi bacaan ikut berganti saat tombol ID/EN
 * ditekan — bukan cuma chrome UI React di sekitarnya.
 *
 * ------------------------------------------------------------------
 * KENAPA PER KATEGORI, BUKAN PER JUDUL BUKU?
 * ------------------------------------------------------------------
 * Sebagian besar buku di database (Harry Potter, Naruto, One Piece, Dune,
 * Atomic Habits, Sapiens, Clean Code, dst) adalah karya berhak cipta aktif
 * milik penulis/penerbit aslinya. Menulis "cuplikan bacaan" yang memakai
 * tokoh, dunia fiksi, atau alur cerita spesifik dari buku-buku itu — walau
 * kalimatnya ditulis sendiri dari nol — tetap termasuk karya turunan
 * (derivative work) dari IP berhak cipta orang lain, dan itu di luar batas
 * yang boleh dibuatkan.
 *
 * Solusinya: setiap kategori (Fiksi, Sains, Teknologi, dst) diberi teks
 * ORIGINAL tulisan sendiri yang relevan dengan TEMA kategori tersebut,
 * tanpa memakai nama tokoh/dunia/alur dari buku manapun yang berhak cipta.
 * Tiap kategori punya 2 varian (A/B) yang dipilih bergilir per buku
 * (lihat SampleBookPdfGenerator::pickVariant()), supaya buku-buku dalam
 * kategori yang sama tidak tampil 100% identik satu sama lain.
 *
 * Versi EN BUKAN hasil terjemahan mesin kata-per-kata — ditulis ulang
 * secara natural supaya enak dibaca sebagai teks Inggris asli, dengan
 * alur cerita/gagasan yang sama persis dengan versi ID-nya per paragraf
 * (paragraf ke-N versi id selalu berpasangan makna dengan paragraf ke-N
 * versi en), supaya berpindah bahasa terasa konsisten.
 *
 * Kalau Anda ingin mengganti salah satu buku dengan bacaan ASLI yang
 * memang sah dipakai (mis. domain publik atau lisensi sendiri), tetap
 * pakai fitur Admin > Data Buku > Upload PDF — generator ini otomatis
 * tidak akan menimpanya lagi (lihat SampleBookPdfGenerator::generate()).
 */
class SampleReadingContent
{
    /**
     * @param  string  $lang  'id' atau 'en'. Nilai lain otomatis fallback ke 'id'.
     * @return array<string, array{0: string[], 1: string[]}> Setiap kategori
     *  punya 2 varian (index 0 dan 1), masing-masing berisi 4 paragraf
     *  (satu paragraf = satu "Bab").
     */
    public static function all(string $lang = 'id'): array
    {
        return $lang === 'en' ? self::en() : self::id();
    }

    private static function id(): array
    {
        return [
            'Fiksi' => [
                [
                    'Kereta terakhir menuju kota kecil itu selalu sepi menjelang tengah malam. Seorang perempuan duduk di dekat jendela, memandangi lampu-lampu yang berlarian ke belakang, membawa serta bertahun-tahun yang ia habiskan di tempat lain. Ia pulang bukan karena rindu, melainkan karena sebuah surat singkat yang tiba tanpa nama pengirim, berisi satu kalimat yang mengusik: "Rumah itu masih menunggumu."',
                    'Stasiun itu tidak banyak berubah — bangku kayu yang sama, jam dinding yang telat lima menit, dan bau hujan yang menempel di atap seng. Yang berubah hanya dirinya. Ia berjalan pelan menyusuri jalan setapak, menghitung rumah-rumah yang masih ia kenali, sampai berhenti di depan pagar yang catnya mulai mengelupas. Tangannya gemetar saat menyentuh gerendel pintu yang dulu selalu berbunyi.',
                    'Di dalam, semuanya seperti dibekukan waktu: meja makan dengan taplak yang sama, foto-foto yang mulai menguning, dan aroma kayu tua yang membangunkan ingatan yang selama ini ia kubur dalam-dalam. Ia duduk di kursi favoritnya dulu, menatap ruangan kosong itu, dan untuk pertama kalinya sejak bertahun-tahun, ia membiarkan dirinya menangis tanpa alasan yang perlu dijelaskan pada siapa pun.',
                    'Esok paginya, seorang tetangga lama mengetuk pintu, membawa kue dan cerita-cerita yang tertunda selama bertahun-tahun. Perlahan, ia sadar bahwa surat tanpa nama itu bukan undangan untuk kembali ke masa lalu, melainkan izin untuk akhirnya berdamai dengannya. Dan di kota kecil yang tidak banyak berubah itu, ia mulai menulis babak barunya sendiri — dengan kecepatan yang, kali ini, benar-benar ia tentukan sendiri.',
                ],
                [
                    'Hujan turun deras ketika dua orang asing berbagi payung yang sama di halte yang sama, menunggu bus yang tak kunjung datang. Mereka tidak saling kenal, tapi ada sesuatu dalam diam yang canggung itu yang terasa akrab — seolah keduanya sedang menyembunyikan hal yang serupa. Salah satu dari mereka akhirnya bicara duluan, bukan basa-basi tentang cuaca, melainkan pertanyaan yang aneh: "Apakah kamu juga sedang lari dari sesuatu?"',
                    'Percakapan itu mengalir lebih jauh dari yang diduga keduanya. Cerita tentang pekerjaan yang ditinggalkan, tentang keputusan besar yang belum berani diambil, tentang rumah yang terasa asing walau sudah ditinggali bertahun-tahun. Bus yang mereka tunggu lewat begitu saja, tak satu pun dari mereka beranjak untuk mengejarnya. Ada yang lebih penting sedang terjadi di bawah payung kecil yang basah kuyup itu.',
                    'Ketika hujan mulai reda, keduanya berjalan tanpa tujuan pasti, menyusuri trotoar yang basah dan dipenuhi pantulan lampu kota. Mereka bicara tentang hal-hal kecil yang biasanya tak pernah diceritakan pada orang asing — ketakutan yang paling sederhana, mimpi yang paling naif, penyesalan yang paling sepi. Malam itu terasa seperti jeda yang lama ditunggu tanpa disadari oleh keduanya.',
                    'Di persimpangan jalan, mereka berpisah tanpa bertukar nomor telepon, tanpa janji akan bertemu lagi. Namun ada sesuatu yang berubah pada keduanya — sebuah keberanian kecil yang dipinjamkan lewat percakapan singkat dengan orang yang tak akan pernah mereka temui lagi. Kadang, tulis seseorang di buku hariannya malam itu, orang asing adalah cermin yang paling jujur.',
                ],
            ],
            'Non-Fiksi' => [
                [
                    'Ada satu kebiasaan yang jarang disadari kebanyakan orang: kita cenderung mengingat hari-hari besar, tapi melupakan ribuan hari biasa yang sebenarnya membentuk siapa kita. Sebuah pagi yang tenang sebelum berangkat kerja, percakapan singkat dengan orang asing di warung kopi, atau lima menit menatap langit sebelum tidur — momen-momen kecil ini jarang dicatat, padahal di situlah sebagian besar hidup kita sesungguhnya terjadi.',
                    'Penelitian tentang ingatan manusia menunjukkan bahwa otak kita secara alami menyaring apa yang layak disimpan lama dan apa yang dibiarkan memudar. Namun menariknya, justru hal-hal kecil yang berulang — rutinitas, kebiasaan, cara seseorang menyapa kita setiap pagi — yang paling banyak memengaruhi suasana hati kita secara keseluruhan, jauh melebihi pengaruh dari satu-dua peristiwa besar yang jarang terjadi.',
                    'Ini membawa pada satu pertanyaan sederhana namun mengganggu: jika hidup sebagian besar disusun dari momen kecil yang tak tercatat, apakah kita sudah cukup memperhatikannya? Banyak orang menghabiskan waktu menunggu momen besar berikutnya — promosi, liburan, pencapaian — sambil tanpa sadar melewatkan detik-detik biasa yang sebenarnya sedang membentuk kualitas hidup mereka hari demi hari.',
                    'Barangkali bukan kebahagiaan besar yang perlu terus-menerus dikejar, melainkan kepekaan terhadap hal-hal kecil yang sudah ada di depan mata. Secangkir kopi yang masih hangat, jalan pulang yang familiar, atau tawa singkat bersama orang terdekat — semua itu, jika benar-benar diperhatikan, mungkin adalah jawaban yang selama ini dicari lewat cara yang jauh lebih rumit.',
                ],
                [
                    'Rasa ingin tahu sering dianggap sifat kekanak-kanakan yang perlahan hilang seiring bertambahnya usia. Padahal, orang-orang yang paling produktif dan puas dengan hidupnya cenderung mempertahankan satu kebiasaan yang sama: mereka terus bertanya "kenapa" dan "bagaimana jika", bahkan untuk hal-hal yang tampak remeh, jauh melampaui usia ketika kebanyakan orang berhenti bertanya.',
                    'Ada perbedaan penting antara rasa ingin tahu yang pasif — sekadar menonton video menarik — dan rasa ingin tahu yang aktif, yaitu keinginan untuk benar-benar memahami sesuatu sampai ke akarnya. Yang kedua inilah yang mendorong orang untuk mencoba hal baru, bertanya pada ahli, atau membongkar sesuatu hanya untuk melihat cara kerjanya, meski risikonya adalah gagal atau terlihat konyol di mata orang lain.',
                    'Ironisnya, sistem pendidikan dan rutinitas kerja modern sering kali justru meredam rasa ingin tahu alami ini demi efisiensi dan kepastian. Kita dilatih untuk mencari jawaban yang benar dengan cepat, bukan untuk menikmati proses bertanya yang lambat dan berliku. Padahal, di situlah letak sebagian besar kegembiraan belajar yang sesungguhnya.',
                    'Memelihara rasa ingin tahu, pada akhirnya, bukan soal mengumpulkan lebih banyak informasi, melainkan soal mempertahankan sikap rendah hati terhadap seberapa banyak hal yang belum kita pahami. Orang yang terus bertanya biasanya juga orang yang terus tumbuh — bukan karena mereka lebih pintar, tapi karena mereka lebih jarang merasa sudah cukup tahu.',
                ],
            ],
            'Teknologi & Komputer' => [
                [
                    'Pukul dua dini hari, layar monitor adalah satu-satunya sumber cahaya di ruangan itu. Sebuah bug kecil — hanya satu baris kode yang salah tempat — berhasil membuat seluruh sistem berhenti bekerja sejak sore. Setelah berjam-jam menelusuri log satu per satu, akhirnya ditemukan: sebuah tanda kurung yang lupa ditutup, tersembunyi tiga ratus baris dari tempat error itu pertama kali muncul.',
                    'Pengalaman semacam ini mengajarkan sesuatu yang tidak diajarkan buku manapun secara langsung: bahwa sistem yang baik bukan yang tidak pernah rusak, melainkan yang mudah dipahami ketika rusak. Kode yang rapi, penamaan variabel yang jelas, dan komentar yang jujur tentang alasan sebuah keputusan diambil — semua itu adalah hadiah untuk diri sendiri di masa depan, atau untuk orang lain yang akan meneruskan pekerjaan itu.',
                    'Ada godaan untuk selalu terburu-buru menyelesaikan fitur secepat mungkin, mengabaikan struktur demi tenggat waktu. Namun setiap baris kode yang ditulis dengan asal-asalan adalah utang yang harus dibayar kembali, biasanya dengan bunga yang lebih besar, dalam bentuk waktu debugging yang jauh lebih panjang di kemudian hari.',
                    'Menariknya, para pengembang paling berpengalaman bukanlah mereka yang paling jarang membuat kesalahan, melainkan mereka yang paling cepat mengenali pola kesalahan yang sama saat itu terjadi lagi. Pengalaman, dalam dunia teknologi, sering kali bukan tentang menghafal solusi, tapi tentang membangun intuisi — kemampuan menebak di mana kemungkinan masalah bersembunyi, jauh sebelum pesan error itu benar-benar muncul di layar.',
                ],
                [
                    'Sebuah sistem perangkat lunak besar jarang dibangun oleh satu orang jenius yang bekerja sendirian — ia lebih mirip kota yang tumbuh dari waktu ke waktu, dibangun lapis demi lapis oleh banyak tangan yang tidak pernah saling bertemu. Fondasi yang ditulis bertahun-tahun lalu masih menopang fitur yang dipakai jutaan orang hari ini, sering kali tanpa ada yang benar-benar mengingat siapa penulis aslinya.',
                    'Yang membuat sistem semacam ini bisa bertahan lama bukanlah karena tidak pernah diubah, melainkan karena dirancang untuk BISA diubah. Antarmuka yang jelas antar bagian, dokumentasi yang jujur, dan disiplin untuk tidak menambal masalah dengan jalan pintas — semua itu adalah investasi jangka panjang yang hasilnya baru terasa bertahun-tahun kemudian, saat sistem itu harus tumbuh menghadapi kebutuhan yang bahkan belum terpikirkan saat pertama kali dibangun.',
                    'Ironisnya, kode yang paling elegan sering kali adalah yang paling mudah dianggap remeh — sederhana, mudah dibaca, tidak menyombongkan kepintaran penulisnya. Sementara kode yang rumit dan penuh trik sering kali justru menyembunyikan masalah yang belum terlihat, hanya menunggu waktu yang tepat untuk muncul ke permukaan.',
                    'Pada akhirnya, membangun perangkat lunak yang baik lebih menyerupai merawat taman ketimbang mendirikan monumen sekali jadi. Ia butuh perhatian berkelanjutan, kesediaan untuk mencabut yang sudah tidak berguna, dan kesabaran untuk membiarkan sesuatu tumbuh dengan kecepatannya sendiri — bukan dipaksakan selesai dalam semalam demi terlihat mengesankan.',
                ],
            ],
            'Sains' => [
                [
                    'Di sebuah observatorium yang sunyi di pegunungan, seorang peneliti muda menghabiskan malam ketiga berturut-turut menatap layar yang menampilkan titik-titik cahaya dari galaksi yang jaraknya jutaan tahun cahaya. Cahaya yang sedang ia amati sebenarnya sudah berangkat jauh sebelum manusia mengenal tulisan — ia sedang menatap masa lalu semesta, bukan masa kininya.',
                    'Ada sesuatu yang membuat rendah hati dari kenyataan sesederhana itu: bahwa setiap kali kita mendongak ke langit malam, kita tidak sedang melihat bintang seperti apa adanya sekarang, melainkan cahaya lama yang baru saja tiba. Beberapa bintang yang tampak berkelip malam ini bahkan mungkin sudah tidak ada lagi, padam ribuan tahun lalu, jauh sebelum cahayanya sempat menyeberangi jarak yang memisahkan kita.',
                    'Semesta, dalam skala seperti ini, mengajarkan bahwa waktu dan jarak sebenarnya adalah hal yang sama, hanya dilihat dari sudut yang berbeda. Untuk memahami sesuatu yang sangat jauh, kita sebenarnya sedang mencoba memahami sesuatu yang sangat lama — dan sebaliknya, untuk memahami masa lalu, terkadang kita perlu belajar melihat lebih jauh dari yang pernah dibayangkan sebelumnya.',
                    'Menjelang subuh, sang peneliti akhirnya mematikan layarnya, membawa pulang bukan jawaban pasti, melainkan pertanyaan baru yang lebih tajam dari sebelumnya. Dalam sains, itu justru pertanda kemajuan — bukan karena semakin banyak yang diketahui, tapi karena semakin jelas terlihat betapa luasnya yang belum diketahui.',
                ],
                [
                    'Metode ilmiah sering digambarkan sebagai proses yang dingin dan mekanis, padahal jantungnya adalah kesabaran yang sangat manusiawi: mengajukan dugaan, mengujinya, lalu bersedia mengakui ketika dugaan itu ternyata keliru. Banyak penemuan besar justru lahir dari eksperimen yang "gagal" — hasil yang tidak sesuai harapan, namun cukup jujur untuk tidak diabaikan begitu saja.',
                    'Ada godaan alami bagi siapa pun, termasuk ilmuwan, untuk hanya melihat data yang mendukung apa yang sudah dipercaya sebelumnya. Disiplin ilmiah yang sesungguhnya justru terletak pada kemauan mencari cara membuktikan diri sendiri salah — sebuah sikap yang jauh lebih sulit dipraktikkan daripada sekadar dipahami secara teori.',
                    'Kemajuan sains jarang datang dalam lompatan besar yang dramatis seperti sering digambarkan. Ia lebih sering berupa langkah-langkah kecil yang membosankan: mengulang eksperimen yang sama berkali-kali, mencatat hasil yang tampak tidak penting, dan perlahan menyusun pola dari ribuan pengamatan kecil yang masing-masing terlihat remeh jika berdiri sendiri.',
                    'Namun dari akumulasi kesabaran semacam itulah lahir pemahaman yang mengubah cara manusia memandang dunia — dari bentuk bumi, sebab penyakit, hingga asal-usul kehidupan itu sendiri. Sains, pada akhirnya, adalah bukti bahwa rasa ingin tahu yang dijalankan dengan disiplin bisa menjadi salah satu kekuatan paling besar yang dimiliki manusia.',
                ],
            ],
            'Sejarah' => [
                [
                    'Di sudut sebuah arsip tua, tersimpan sepucuk surat yang tidak pernah sempat dikirim, ditulis oleh seseorang yang namanya nyaris tidak tercatat di buku sejarah manapun. Isinya sederhana — kabar tentang panen yang gagal, kerinduan pada keluarga, kekhawatiran tentang masa depan yang tidak menentu. Namun surat sesederhana itu menyimpan sesuatu yang jarang ditemukan di buku-buku sejarah besar: suara orang biasa yang benar-benar hidup di zamannya.',
                    'Sejarah sering diceritakan lewat nama-nama besar dan keputusan-keputusan penting yang diambil di ruang-ruang tertutup. Namun di balik setiap peristiwa besar, ada ribuan kehidupan kecil yang ikut terguncang, beradaptasi, dan bertahan — petani, pedagang, guru, ibu rumah tangga — yang keputusan sehari-harinya jarang dicatat, tapi sama nyatanya dengan keputusan para pemimpin yang namanya diabadikan.',
                    'Menariknya, banyak perubahan besar dalam sejarah justru dimulai dari keputusan kecil yang pada saat itu tidak terlihat penting sama sekali: seseorang yang menolak pindah, sebuah surat yang akhirnya sampai ke tangan yang tepat, atau keputusan untuk tetap tinggal satu musim lagi. Sejarah, dilihat dari dekat, jauh lebih acak dan manusiawi dibanding kesan rapi yang sering diberikan buku pelajaran.',
                    'Membaca arsip-arsip kecil semacam ini mengingatkan bahwa setiap orang yang hidup hari ini juga sedang menulis sejarahnya sendiri, meski sebagian besar tidak akan pernah tercatat di buku manapun. Namun seperti surat yang tidak pernah terkirim itu, jejak-jejak kecil itu tetap punya nilai — bukan karena diingat banyak orang, tapi karena pernah benar-benar dijalani.',
                ],
                [
                    'Sebuah kota kecil pernah nyaris hilang dari peta hanya karena satu keputusan yang diambil tergesa-gesa di masa krisis: memindahkan jalur perdagangan utama ke kota tetangga. Butuh puluhan tahun bagi penduduknya untuk pulih, dan lebih lama lagi bagi sejarah untuk mencatat bahwa keputusan itu sebenarnya bisa dihindari, seandainya satu suara yang menentang saat itu didengarkan dengan lebih serius.',
                    'Kisah semacam ini berulang dalam berbagai bentuk sepanjang sejarah manusia: keputusan yang tampak kecil dan teknis pada masanya, ternyata membawa akibat yang jauh lebih besar dan lebih lama dari yang pernah dibayangkan siapa pun yang mengambilnya. Sejarah jarang bergerak lurus — ia lebih sering berbelok karena hal-hal yang, pada waktunya, tampak tidak seberapa penting.',
                    'Mempelajari sejarah, dengan demikian, bukan sekadar menghafal tanggal dan nama, melainkan melatih diri untuk melihat bagaimana keputusan kecil hari ini bisa menjadi fondasi — atau retakan — bagi keadaan puluhan tahun mendatang. Perspektif ini sering hilang ketika seseorang terjebak dalam kesibukan sehari-hari yang serba mendesak.',
                    'Kota kecil itu akhirnya bangkit kembali, meski dengan wajah yang berbeda dari sebelumnya. Generasi baru penduduknya tumbuh tanpa banyak tahu tentang keputusan lama yang pernah membentuk hidup mereka — sebuah pengingat bahwa sejarah terus bekerja diam-diam, bahkan ketika tidak seorang pun sedang memperhatikannya.',
                ],
            ],
            'Biografi & Memoar' => [
                [
                    'Kegagalan pertamanya datang jauh lebih awal dari yang pernah ia ceritakan pada siapa pun: sebuah proyek yang ambruk total, meninggalkan utang dan rasa malu yang terasa seperti akhir dari segalanya pada waktu itu. Bertahun-tahun kemudian, ia baru menyadari bahwa momen itulah, bukan pencapaian besarnya di kemudian hari, yang sebenarnya membentuk caranya memandang hidup untuk seterusnya.',
                    'Yang jarang diceritakan tentang kegagalan besar adalah betapa sepinya periode setelahnya — masa ketika dukungan orang lain mulai menghilang, dan satu-satunya yang tersisa hanyalah pilihan untuk bangkit atau menyerah sepenuhnya. Tidak ada musik dramatis, tidak ada momen pencerahan tiba-tiba. Hanya rutinitas kecil yang diulang setiap hari, sering kali tanpa keyakinan bahwa itu akan membuahkan hasil.',
                    'Perlahan, dari rutinitas kecil itulah sesuatu mulai berubah — bukan karena keajaiban, melainkan karena konsistensi yang, tanpa disadari, membangun kembali kepercayaan diri yang sebelumnya hancur. Ia mulai mengambil langkah-langkah yang jauh lebih kecil dan lebih hati-hati dibanding sebelumnya, tapi kali ini dengan pemahaman yang tidak ia miliki di percobaan pertamanya.',
                    'Bertahun-tahun kemudian, ketika orang-orang bertanya tentang rahasia kesuksesannya, ia selalu kembali pada satu jawaban yang sama, meski terdengar terlalu sederhana untuk dipercaya: bukan karena tidak pernah gagal, melainkan karena belajar untuk tidak menjadikan satu kegagalan sebagai kesimpulan akhir tentang siapa dirinya.',
                ],
                [
                    'Disiplinnya dimulai dari sesuatu yang sangat kecil dan hampir tidak terlihat: bangun tiga puluh menit lebih awal setiap hari, hanya untuk duduk diam dan menulis rencana hari itu di atas kertas. Tidak ada yang istimewa dari kebiasaan ini pada awalnya — bahkan ia sendiri sering meragukan gunanya.',
                    'Namun kebiasaan kecil itu bertahan jauh lebih lama dari rencana-rencana besar yang pernah ia buat sebelumnya. Selama bertahun-tahun, tanpa disadari, tiga puluh menit itu menjadi fondasi bagi hampir semua keputusan penting dalam hidupnya — bukan karena isinya luar biasa, melainkan karena konsistensinya yang jarang dimiliki kebanyakan orang.',
                    'Orang-orang di sekitarnya sering melihat hasil akhirnya saja — pencapaian, penghargaan, pengakuan — tanpa pernah melihat ribuan pagi sunyi yang mendahuluinya, ketika tidak ada satu pun tepuk tangan, dan satu-satunya penonton adalah dirinya sendiri di meja kerja yang sama setiap hari.',
                    'Ia sering berkata bahwa disiplin bukan tentang motivasi yang menyala-nyala, melainkan tentang kesediaan menunjukkan diri sendiri di hari-hari ketika motivasi itu benar-benar tidak ada. Sebuah kalimat sederhana, namun butuh puluhan tahun baginya untuk benar-benar memahaminya lewat pengalaman, bukan sekadar mendengarnya dari orang lain.',
                ],
            ],
            'Pengembangan Diri' => [
                [
                    'Perubahan besar dalam hidup jarang dimulai dari keputusan besar yang dramatis. Ia lebih sering dimulai dari satu kebiasaan kecil yang diulang secara konsisten — lima menit membaca setiap malam, satu ajakan jalan kaki setiap pagi, satu kalimat syukur sebelum tidur — yang pada awalnya terasa terlalu kecil untuk benar-benar berarti.',
                    'Masalahnya, kebanyakan orang menyerah pada kebiasaan kecil ini justru karena hasilnya tidak langsung terlihat. Padahal, seperti bunga majemuk dalam tabungan, dampak dari kebiasaan kecil yang konsisten baru benar-benar terasa setelah diulang cukup lama — sering kali jauh melampaui titik ketika kebanyakan orang sudah lebih dulu berhenti mencoba.',
                    'Ada satu pergeseran cara pandang yang membantu di sini: alih-alih bertanya "apa hasil yang ingin saya capai", lebih berguna bertanya "menjadi orang seperti apa saya ingin dikenal". Seseorang yang membaca setiap malam, cepat atau lambat, akan menjadi pembaca. Identitas yang terbentuk dari pengulangan kecil ini jauh lebih tahan lama dibanding motivasi sesaat yang mudah padam.',
                    'Pada akhirnya, pertumbuhan diri bukan tentang menjadi orang yang sepenuhnya berbeda dalam semalam, melainkan tentang menjadi sedikit lebih baik dari versi diri kemarin, berulang kali, dalam waktu yang cukup lama untuk membiarkan perubahan kecil itu terkumpul menjadi sesuatu yang benar-benar terasa.',
                ],
                [
                    'Rasa takut sebelum melakukan sesuatu yang baru jarang benar-benar hilang, bahkan pada orang yang tampak paling percaya diri sekalipun. Yang membedakan mereka bukan ketiadaan rasa takut, melainkan kebiasaan untuk tetap melangkah walau rasa takut itu masih ada — sebuah keterampilan yang, seperti otot, hanya bisa dilatih lewat pengulangan, bukan sekadar dipahami secara teori.',
                    'Banyak orang menunggu rasa percaya diri datang lebih dulu sebelum berani mencoba sesuatu yang baru. Padahal urutannya sering kali terbalik: tindakan kecil yang diambil meski masih takut itulah yang, perlahan, membangun rasa percaya diri — bukan sebaliknya. Menunggu rasa takut hilang sepenuhnya sebelum bertindak sering kali berarti menunggu selamanya.',
                    'Langkah pertama yang paling menakutkan biasanya juga yang paling kecil kelihatannya dari luar: mengirim satu pesan, mengangkat tangan satu kali, mendaftar untuk satu kesempatan. Namun justru langkah kecil itulah yang memisahkan antara keinginan yang hanya dipikirkan dan keinginan yang benar-benar mulai dijalani.',
                    'Seiring waktu, keberanian mengambil langkah kecil ini terakumulasi menjadi sesuatu yang lebih besar: bukan rasa takut yang hilang sepenuhnya, melainkan kepercayaan bahwa rasa takut itu tidak perlu menjadi penentu apakah sebuah langkah layak diambil atau tidak.',
                ],
            ],
            'Bisnis & Ekonomi' => [
                [
                    'Sebuah usaha kecil di sudut pasar bertahan lebih dari dua dekade bukan karena produknya paling murah, melainkan karena pemiliknya memahami satu hal yang sering dilupakan pebisnis besar: pelanggan datang kembali bukan hanya untuk barang yang dibeli, tapi untuk perasaan diperhatikan yang mereka dapatkan setiap kali datang.',
                    'Ketika krisis ekonomi melanda dan banyak usaha sejenis gulung tikar, usaha kecil ini justru bertahan dengan cara yang tidak masuk akal bagi kebanyakan konsultan bisnis: mengurangi margin keuntungan demi mempertahankan harga yang terjangkau bagi pelanggan setia, dengan keyakinan bahwa hubungan jangka panjang lebih berharga daripada keuntungan jangka pendek.',
                    'Keputusan itu, yang pada masanya tampak berisiko dan kurang strategis, ternyata menjadi fondasi loyalitas yang tidak bisa dibeli dengan strategi pemasaran mana pun. Pelanggan yang dibantu di masa sulit menjadi pelanggan yang paling setia bertahun-tahun kemudian, bahkan ketika pesaing menawarkan harga yang jauh lebih murah.',
                    'Kisah ini menyimpan pelajaran sederhana tentang nilai dalam bisnis: angka di laporan keuangan penting, tapi kepercayaan yang dibangun lewat konsistensi bertahun-tahun sering kali menjadi aset yang jauh lebih sulit ditiru pesaing manapun, dan jauh lebih tahan terhadap guncangan ekonomi yang datang silih berganti.',
                ],
                [
                    'Setiap keputusan bisnis, pada dasarnya, adalah taruhan tentang masa depan yang tidak pernah bisa dipastikan sepenuhnya. Yang membedakan pengusaha berpengalaman dari pemula bukanlah kemampuan menghilangkan risiko itu, melainkan kemampuan mengambil risiko yang telah diperhitungkan dengan cermat, dan bersedia menanggung akibat terburuknya tanpa kehilangan arah.',
                    'Banyak peluang bisnis besar justru muncul dari masalah yang tampak terlalu kecil atau terlalu rumit untuk diselesaikan orang lain. Justru karena kebanyakan orang menghindarinya, ruang untuk berinovasi di sana menjadi lebih luas — sebuah paradoks yang sering luput dari perhatian mereka yang hanya mengejar tren yang sedang populer.',
                    'Memahami risiko dengan baik bukan berarti menjadi berani secara membabi buta, melainkan menjadi jujur tentang skenario terburuk yang mungkin terjadi, dan mempersiapkan diri untuk itu sebelum benar-benar melangkah. Pengusaha yang bertahan lama biasanya bukan yang paling optimis, melainkan yang paling realistis sekaligus tetap mau mencoba.',
                    'Pada akhirnya, ekonomi dan bisnis bukan sekadar soal angka dan grafik, melainkan soal memahami perilaku manusia — apa yang benar-benar mereka butuhkan, apa yang membuat mereka percaya, dan apa yang membuat mereka kembali lagi. Yang memahami hal ini lebih dalam dari pesaingnya, biasanya, yang bertahan paling lama.',
                ],
            ],
            'Agama & Spiritual' => [
                [
                    'Di tengah rutinitas yang serba cepat, ada satu praktik sederhana yang sering terlupakan: berhenti sejenak, menarik napas dalam-dalam, dan benar-benar menyadari apa yang sedang disyukuri saat itu juga — bukan sesuatu yang besar atau istimewa, cukup hal-hal kecil yang biasanya luput dari perhatian karena dianggap terlalu biasa.',
                    'Ketenangan batin jarang datang dari tidak adanya masalah, melainkan dari kemampuan menerima bahwa hidup akan selalu diwarnai ketidakpastian, dan tetap memilih untuk merasa cukup di tengah ketidakpastian itu. Ini bukan sikap pasrah tanpa usaha, melainkan kedamaian yang lahir dari pemahaman bahwa tidak semua hal berada dalam kendali kita.',
                    'Banyak tradisi spiritual, dengan caranya masing-masing, mengajarkan hal yang serupa: bahwa kebahagiaan sejati tidak terletak pada seberapa banyak yang dimiliki, melainkan pada seberapa dalam rasa syukur yang bisa dirasakan atas apa yang sudah ada. Kalimat ini mudah diucapkan, tapi butuh latihan seumur hidup untuk benar-benar dihayati.',
                    'Barangkali, ketenangan yang selama ini dicari lewat berbagai cara sebenarnya sudah tersedia setiap saat, menunggu untuk disadari lewat jeda-jeda kecil di tengah kesibukan — satu tarikan napas, satu momen syukur, satu kesadaran bahwa saat ini pun, dengan segala kekurangannya, sudah cukup untuk disyukuri.',
                ],
                [
                    'Kebaikan yang paling berarti sering kali bukan yang paling besar, melainkan yang paling tulus — sebuah bantuan kecil yang diberikan tanpa mengharapkan balasan atau pengakuan, kepada seseorang yang bahkan mungkin tidak pernah tahu siapa yang membantunya.',
                    'Ada kekuatan tersendiri dalam kesediaan untuk memahami orang lain tanpa buru-buru menghakimi — mendengarkan cerita seseorang sampai selesai sebelum menyimpulkan, membayangkan beban yang mungkin sedang mereka pikul, yang tidak terlihat dari luar. Empati semacam ini jarang mudah dilakukan, terutama kepada orang yang berbeda pandangan dengan kita.',
                    'Banyak ajaran spiritual sepakat pada satu titik: bahwa hubungan kita dengan sesama manusia adalah cerminan dari hubungan kita dengan sesuatu yang lebih besar dari diri sendiri. Merawat hubungan itu dengan kesabaran dan kejujuran, dengan demikian, bukan sekadar kewajiban sosial, melainkan bagian dari perjalanan batin itu sendiri.',
                    'Pada akhirnya, kedamaian yang dicari banyak orang jarang ditemukan dalam kesendirian total, melainkan dalam keterhubungan yang tulus dengan sesama — dalam kesediaan untuk hadir sepenuhnya bagi orang lain, sesederhana apa pun bentuknya, dan menerima kehadiran mereka kembali dengan cara yang sama.',
                ],
            ],
            'Anak & Remaja' => [
                [
                    'Di ujung halaman belakang rumah, ada sepetak kebun kecil yang setiap paginya selalu didatangi oleh seorang anak dengan buku catatan lusuh di tangannya. Ia mencatat setiap hal baru yang ditemukannya — seekor kupu-kupu dengan sayap yang belum pernah dilihatnya, jejak kaki hewan yang tidak dikenalinya, atau bentuk awan yang menurutnya mirip kapal.',
                    'Suatu pagi, ia menemukan sesuatu yang benar-benar baru: sebuah lubang kecil di bawah pohon mangga tua, dengan jejak-jejak kecil di sekitarnya yang belum pernah ia catat sebelumnya. Alih-alih takut, ia justru semakin penasaran, duduk diam-diam di dekatnya selama berjam-jam, menunggu untuk melihat siapa pemilik jejak itu.',
                    'Kesabarannya terbayar ketika seekor kelinci kecil akhirnya keluar dari lubangnya, mengendus-endus udara sebelum melompat kecil ke arah semak. Ia tidak mengejarnya, hanya mengamatinya dari jarak aman sambil tersenyum lebar, lalu buru-buru menulis semua yang ia lihat di buku catatannya sebelum lupa satu detail pun.',
                    'Malam itu, ia bercerita panjang lebar kepada keluarganya tentang penemuannya, matanya berbinar-binar seolah baru saja menemukan harta karun. Bagi orang dewasa, itu hanyalah seekor kelinci biasa. Namun baginya, itu adalah bukti bahwa dunia di sekitar rumahnya masih menyimpan banyak kejutan, asalkan ia mau cukup sabar untuk memperhatikannya.',
                ],
                [
                    'Tiga sahabat selalu berkumpul di pohon besar dekat lapangan sekolah setiap pulang sekolah, membicarakan rencana-rencana kecil yang menurut mereka sangat penting — mulai dari membangun rumah pohon hingga memecahkan misteri suara aneh yang sering terdengar dari gudang tua di ujung jalan.',
                    'Ketika salah satu dari mereka dipindahkan ke sekolah lain karena keluarganya harus pindah kota, dua sahabat yang tersisa merasa kehilangan yang begitu besar, seolah bagian penting dari rutinitas mereka ikut hilang. Mereka sempat berdebat tentang bagaimana caranya tetap menjaga persahabatan itu meski jaraknya sekarang jauh berbeda.',
                    'Salah satu dari mereka punya ide: menulis surat setiap minggu, menceritakan hal-hal kecil yang terjadi, seperti dulu mereka lakukan di bawah pohon besar itu. Awalnya terasa aneh menulis surat di zaman semua orang sudah punya ponsel, tapi lama-lama kebiasaan itu justru menjadi hal yang paling mereka nantikan setiap minggunya.',
                    'Bertahun-tahun kemudian, ketiganya masih menyimpan surat-surat itu dalam kotak kayu tua, sebagai bukti bahwa persahabatan yang sungguh-sungguh tidak ditentukan oleh seberapa dekat jaraknya, melainkan oleh seberapa besar usaha yang dilakukan untuk tetap saling hadir, meski dengan cara yang sederhana.',
                ],
            ],
            'Komik & Graphic Novel' => [
                [
                    'Fajar belum sepenuhnya merekah ketika seorang murid muda sudah berdiri di halaman berlatih, keringat membasahi seragam lusuhnya. Gurunya duduk di beranda, mengawasi dalam diam, sesekali membetulkan posisi kuda-kuda muridnya hanya dengan satu kata singkat, tanpa pernah memuji, tanpa pernah benar-benar puas.',
                    '"Kekuatan sejati," kata sang guru akhirnya, memecah keheningan pagi itu, "bukan datang dari seberapa keras pukulanmu, melainkan dari seberapa sering kamu bangun setelah jatuh, tanpa seorang pun yang menyuruhmu untuk terus mencoba." Sang murid tidak menjawab, hanya mengangguk pelan sambil mengatur napas yang masih tersengal.',
                    'Latihan hari itu berakhir seperti biasa — tanpa kemenangan besar, tanpa terobosan dramatis, hanya perbaikan kecil yang nyaris tak terlihat dari luar. Namun sang murid tahu, jauh di dalam dirinya, bahwa perbaikan kecil semacam itulah yang, jika diulang cukup lama, suatu hari akan berubah menjadi kekuatan yang sesungguhnya.',
                    'Ketika matahari akhirnya terbit penuh di ufuk timur, sang murid berdiri sekali lagi di posisi awal, siap mengulang latihan yang sama untuk kesekian ribu kalinya. Ia tahu jalan menuju kekuatan sejati masih panjang, tapi untuk pertama kalinya, ia merasa tidak sabar untuk menempuhnya — bukan karena ingin cepat sampai, melainkan karena mulai menikmati setiap langkah perjalanannya.',
                ],
                [
                    'Rombongan kecil itu berhenti di puncak bukit, memandangi hamparan tanah asing yang belum pernah dijejaki siapa pun dari kampung halaman mereka. Peta yang mereka bawa sudah tidak banyak membantu lagi — ujungnya kosong, tanda bahwa mereka telah melangkah lebih jauh dari yang pernah dipetakan siapa pun sebelumnya.',
                    '"Kita bisa kembali sekarang," ujar salah satu dari mereka, suaranya bergetar antara lelah dan takut. Namun yang lain menggeleng pelan, menatap cakrawala yang mulai memerah oleh senja. Perjalanan ini bukan lagi soal mencapai tujuan yang mereka rencanakan di awal — ia telah berubah menjadi soal siapa mereka setelah menempuhnya.',
                    'Malam itu, di sekitar api unggun kecil, mereka berbagi cerita tentang alasan masing-masing memulai perjalanan ini — sebagian karena terpaksa, sebagian karena mencari sesuatu yang hilang, dan sebagian lagi karena tidak tahu ke mana lagi harus pergi. Namun malam itu, untuk pertama kalinya, alasan-alasan itu terasa tidak lagi penting dibandingkan fakta bahwa mereka masih bersama.',
                    'Esok paginya, rombongan itu melanjutkan langkah mereka menuruni bukit, menuju tanah asing yang menanti di depan. Tidak seorang pun tahu pasti apa yang akan mereka temui, tapi untuk pertama kalinya sejak perjalanan dimulai, ketidaktahuan itu terasa lebih seperti petualangan dibanding ancaman.',
                ],
            ],
            'Kesehatan & Gaya Hidup' => [
                [
                    'Tubuh manusia jarang memberi peringatan dengan cara yang dramatis ketika kelelahan sudah menumpuk terlalu lama — ia lebih sering berbisik lewat tanda-tanda kecil yang mudah diabaikan: tidur yang tidak lagi terasa cukup, konsentrasi yang mulai buyar, atau suasana hati yang lebih mudah tersulut tanpa alasan jelas.',
                    'Banyak orang baru benar-benar memperhatikan tubuhnya setelah tanda-tanda kecil itu berkembang menjadi masalah yang lebih besar, padahal tubuh sebenarnya sudah memberi sinyal jauh sebelum titik itu. Belajar mengenali sinyal-sinyal kecil ini — dan cukup berani untuk beristirahat sebelum benar-benar dipaksa berhenti — adalah keterampilan yang jarang diajarkan secara langsung.',
                    'Istirahat, dalam banyak budaya modern, sering dianggap sebagai tanda kemalasan atau kurangnya ambisi. Padahal secara biologis, istirahat yang cukup adalah saat tubuh memperbaiki dirinya sendiri, mengonsolidasikan ingatan, dan memulihkan energi yang akan menentukan kualitas hari-hari berikutnya. Mengabaikannya bukan tanda kerja keras, melainkan utang yang cepat atau lambat harus dibayar.',
                    'Menariknya, orang-orang yang paling produktif dalam jangka panjang biasanya bukan yang bekerja paling lama tanpa henti, melainkan yang paling disiplin menjaga keseimbangan antara kerja dan istirahat. Mereka memperlakukan tidur dan waktu jeda bukan sebagai hadiah setelah bekerja keras, melainkan sebagai bagian yang sama pentingnya dari proses itu sendiri.',
                ],
                [
                    'Gerakan tubuh yang paling bermanfaat bagi kesehatan sering kali bukan yang paling intens, melainkan yang paling konsisten dilakukan dalam waktu lama — jalan kaki singkat setiap hari ternyata memberi dampak jangka panjang yang tidak kalah berarti dibanding olahraga berat yang hanya dilakukan sesekali lalu ditinggalkan.',
                    'Banyak orang terjebak dalam pola naik-turun: bersemangat berolahraga secara intens selama beberapa minggu, lalu berhenti total karena kelelahan atau kehilangan motivasi. Pola ini, meski terasa produktif dalam jangka pendek, justru kurang bermanfaat dibanding kebiasaan sederhana yang dijaga tanpa jeda panjang.',
                    'Merawat tubuh, pada dasarnya, lebih menyerupai merawat hubungan jangka panjang dibanding menyelesaikan proyek dengan tenggat waktu tertentu. Ia membutuhkan perhatian yang berkelanjutan, bukan usaha besar yang meledak-ledak sesekali lalu diikuti pengabaian total dalam waktu yang lama.',
                    'Perubahan kecil yang konsisten — tidur cukup, bergerak setiap hari meski sebentar, makan dengan lebih penuh kesadaran — jarang terasa dramatis dalam jangka pendek. Namun seperti kebanyakan hal yang benar-benar berharga dalam hidup, hasilnya baru benar-benar terlihat setelah dijaga cukup lama, jauh melampaui titik ketika kebanyakan orang sudah lebih dulu menyerah.',
                ],
            ],
        ];
    }

    private static function en(): array
    {
        return [
            'Fiksi' => [
                [
                    "The last train to the small town was always quiet close to midnight. A woman sat by the window, watching the lights streak past, carrying with her all the years she had spent somewhere else. She wasn't coming home out of longing, but because of a short, unsigned letter that had arrived out of nowhere, containing a single unsettling line: \"The house is still waiting for you.\"",
                    'The station hadn\'t changed much — the same wooden bench, the same clock running five minutes slow, the same smell of rain clinging to the tin roof. Only she had changed. She walked slowly down the path, counting the houses she still recognized, until she stopped in front of a gate with peeling paint. Her hand trembled as she touched the latch that used to creak every single time.',
                    'Inside, everything felt frozen in time: the same dining table with the same tablecloth, photographs beginning to yellow, and the smell of old wood stirring memories she had spent years burying. She sat in what used to be her favorite chair, staring at the empty room, and for the first time in years, she let herself cry without needing a reason she could explain to anyone.',
                    'The next morning, an old neighbor knocked on the door, bringing cake and stories that had waited years to be told. Slowly, she realized the unsigned letter hadn\'t been an invitation to return to the past, but permission to finally make peace with it. And in that small town that hadn\'t changed much, she began writing a new chapter of her own — at a pace that, this time, was entirely hers to set.',
                ],
                [
                    'Rain poured down as two strangers shared the same umbrella at the same bus stop, waiting for a bus that refused to come. They didn\'t know each other, but there was something in the awkward silence that felt familiar — as if both were hiding something similar. One of them finally spoke first, not small talk about the weather, but an odd question: "Are you running from something too?"',
                    'The conversation went further than either of them expected. Stories about jobs left behind, about big decisions neither had dared to make, about homes that felt foreign despite years of living in them. The bus they were waiting for passed right by, and neither moved to chase it. Something more important was happening under that small, soaked umbrella.',
                    'When the rain finally eased, the two of them walked without any real destination, tracing wet sidewalks scattered with the reflections of city lights. They talked about small things rarely told to strangers — the simplest fears, the most naive dreams, the quietest regrets. That night felt like a pause both of them had been waiting for without ever realizing it.',
                    'At the intersection, they parted without exchanging phone numbers, without any promise to meet again. Yet something in both of them had shifted — a small courage borrowed from a brief conversation with someone they would never see again. Sometimes, one of them wrote in a journal that night, a stranger is the most honest mirror there is.',
                ],
            ],
            'Non-Fiksi' => [
                [
                    "There's a habit most people rarely notice in themselves: we tend to remember the big days but forget the thousands of ordinary ones that actually shape who we are. A quiet morning before work, a brief exchange with a stranger at a coffee stall, five minutes staring at the sky before bed — these small moments are rarely recorded, even though that's where most of our lives are actually happening.",
                    "Research on human memory shows that our brains naturally filter what's worth keeping and what gets allowed to fade. Yet interestingly, it's the small, repeated things — routines, habits, the way someone greets us each morning — that shape our overall mood far more than the one or two big events that rarely happen at all.",
                    "This leads to a simple but nagging question: if life is mostly made of small, unrecorded moments, are we paying enough attention to them? Many people spend their time waiting for the next big moment — a promotion, a vacation, an achievement — while unknowingly letting ordinary seconds slip by, seconds that are quietly shaping the quality of their lives day by day.",
                    "Perhaps it isn't grand happiness that needs to be constantly chased, but sensitivity to the small things already right in front of us. A cup of coffee still warm, a familiar walk home, a brief laugh with someone close — all of it, if truly noticed, might be the answer people have been searching for through far more complicated means.",
                ],
                [
                    'Curiosity is often dismissed as a childish trait that fades with age. Yet the most productive and contented people tend to keep one habit alive: they keep asking "why" and "what if," even about things that seem trivial, long past the age when most people stop asking at all.',
                    'There\'s an important difference between passive curiosity — merely watching an interesting video — and active curiosity, the desire to truly understand something down to its roots. It\'s the latter that pushes people to try new things, ask experts questions, or take something apart just to see how it works, even at the risk of failing or looking foolish to others.',
                    'Ironically, modern education systems and work routines often dampen this natural curiosity in the name of efficiency and certainty. We\'re trained to find the right answer quickly, not to enjoy the slow, winding process of asking questions. Yet that is precisely where most of the real joy of learning lives.',
                    "Nurturing curiosity, in the end, isn't about gathering more information, but about maintaining humility toward how much we still don't understand. People who keep asking questions are usually also people who keep growing — not because they're smarter, but because they less often feel they already know enough.",
                ],
            ],
            'Teknologi & Komputer' => [
                [
                    "At two in the morning, the monitor screen was the only light left in the room. A tiny bug — just one line of misplaced code — had brought the entire system to a halt since the afternoon. After hours of combing through logs one by one, it was finally found: an unclosed bracket, hidden three hundred lines from where the error had first appeared.",
                    "Experiences like this teach something no book ever quite explains directly: that a good system isn't one that never breaks, but one that's easy to understand when it does. Clean code, clear variable names, and honest comments about why a decision was made — all of it is a gift to your future self, or to whoever else ends up carrying the work forward.",
                    "There's always a temptation to rush a feature out as fast as possible, ignoring structure for the sake of a deadline. But every carelessly written line of code is a debt that eventually comes due, usually with interest, in the form of far longer debugging sessions down the road.",
                    "Interestingly, the most experienced developers aren't the ones who make the fewest mistakes, but the ones who recognize familiar patterns of failure the fastest when they resurface. Experience, in technology, is often less about memorizing solutions and more about building intuition — a sense for where a problem is likely hiding, long before an error message ever appears on screen.",
                ],
                [
                    "A large software system is rarely built by a single genius working alone — it resembles a city that grows over time, built layer by layer by countless hands that never meet. Foundations written years ago still support features used by millions today, often with no one quite remembering who originally wrote them.",
                    "What allows a system like this to last isn't that it was never changed, but that it was designed to BE changed. Clear interfaces between parts, honest documentation, and the discipline not to patch problems with shortcuts — all of it is a long-term investment whose payoff is only felt years later, when the system has to grow to meet needs no one had even imagined when it was first built.",
                    "Ironically, the most elegant code is often the easiest to underestimate — simple, readable, never showing off its author's cleverness. Meanwhile, code full of clever tricks often hides problems that haven't surfaced yet, simply waiting for the right moment to appear.",
                    "In the end, building good software resembles tending a garden far more than erecting a monument in one go. It requires ongoing attention, a willingness to pull out what no longer serves, and the patience to let something grow at its own pace — not forced to completion overnight just to look impressive.",
                ],
            ],
            'Sains' => [
                [
                    "In a quiet observatory high in the mountains, a young researcher spent a third night in a row staring at a screen filled with points of light from galaxies millions of light-years away. The light she was observing had actually begun its journey long before humans invented writing — she was looking at the universe's past, not its present.",
                    'There is something humbling in a fact this simple: that every time we look up at the night sky, we are not seeing stars as they are now, but old light that has only just arrived. Some of the stars twinkling tonight may no longer even exist, extinguished thousands of years ago, long before their light finished crossing the distance that separates us.',
                    'The universe, at this scale, teaches that time and distance are really the same thing, seen from different angles. To understand something very far away, we are, in effect, trying to understand something very old — and conversely, to understand the past, we sometimes have to learn to look farther than we ever imagined possible.',
                    "As dawn approached, the researcher finally switched off her screen, carrying home not a definite answer, but a sharper new question. In science, that is precisely a sign of progress — not because more is now known, but because it has become clearer just how vast what remains unknown truly is.",
                ],
                [
                    'The scientific method is often pictured as a cold, mechanical process, when at its heart lies a very human kind of patience: proposing a guess, testing it, then being willing to admit when that guess turns out to be wrong. Many great discoveries were actually born from "failed" experiments — results that didn\'t match expectations, yet were honest enough not to simply be dismissed.',
                    'There is a natural temptation for anyone, scientists included, to only look at data that supports what they already believe. True scientific discipline lies precisely in the willingness to look for ways to prove yourself wrong — an attitude far harder to practice than it is to understand in theory.',
                    'Scientific progress rarely arrives in the dramatic leaps it\'s often portrayed as. It more often comes as small, tedious steps: repeating the same experiment over and over, recording results that seem unimportant, and slowly assembling a pattern out of thousands of small observations that each look trivial on their own.',
                    'Yet from that accumulation of patience comes an understanding that has changed how humanity sees the world — from the shape of the earth, to the causes of disease, to the origins of life itself. Science, in the end, is proof that curiosity pursued with discipline can become one of the most powerful forces a person can hold.',
                ],
            ],
            'Sejarah' => [
                [
                    "Tucked in a corner of an old archive lies a letter that was never sent, written by someone whose name is barely recorded in any history book. Its contents are simple — news of a failed harvest, longing for family, worry over an uncertain future. Yet a letter this ordinary holds something rarely found in grand history books: the voice of an ordinary person who truly lived through their time.",
                    "History is often told through great names and important decisions made behind closed doors. But behind every major event are thousands of small lives that were shaken, that adapted, that endured — farmers, traders, teachers, homemakers — whose everyday decisions are rarely recorded, yet are just as real as the decisions of the leaders whose names get remembered.",
                    "Interestingly, many of history's great turning points actually began with small decisions that, at the time, seemed to carry no weight at all: someone who refused to move, a letter that finally reached the right hands, a decision to stay just one more season. History, seen up close, is far more random and human than the tidy impression textbooks often give.",
                    "Reading small archives like this is a reminder that everyone alive today is also writing their own history, even though most of it will never be recorded in any book. But like that unsent letter, these small traces still carry value — not because they are remembered by many, but because they were genuinely lived.",
                ],
                [
                    'A small town once nearly vanished from the map because of one hasty decision made during a crisis: rerouting the main trade path to a neighboring town. It took decades for its people to recover, and even longer for history to note that the decision could have been avoided, had one dissenting voice been taken more seriously at the time.',
                    "Stories like this repeat in countless forms throughout human history: decisions that seemed small and technical at the time end up carrying consequences far larger and longer-lasting than anyone who made them ever imagined. History rarely moves in a straight line — it far more often bends because of things that, at the time, seemed hardly worth noticing.",
                    "Studying history, then, isn't simply about memorizing dates and names, but about training oneself to see how a small decision today can become a foundation — or a fault line — for circumstances decades from now. This perspective is easily lost when someone is caught up in the urgency of everyday life.",
                    "The small town eventually rose again, though wearing a different face than before. New generations grew up knowing little about the old decision that had once shaped their lives — a reminder that history keeps working quietly, even when no one is paying attention.",
                ],
            ],
            'Biografi & Memoar' => [
                [
                    "His first failure came far earlier than he ever told anyone: a project that collapsed completely, leaving behind debt and a shame that felt, at the time, like the end of everything. Years later, he would come to realize that it was that moment, not his later achievements, that truly shaped the way he would see life from then on.",
                    "What's rarely told about major failure is how quiet the period afterward becomes — a time when other people's support starts to fade, and all that's left is a choice between getting back up or giving up entirely. There's no dramatic music, no sudden moment of clarity. Just small routines repeated every day, often without any real conviction that they'll amount to anything.",
                    "Slowly, from those small routines, something began to shift — not through any miracle, but through a consistency that, without him realizing it, began rebuilding a confidence that had once been shattered. He started taking steps far smaller and more careful than before, but this time with an understanding he hadn't had the first time around.",
                    "Years later, when people asked about the secret to his success, he always returned to the same answer, even though it sounded too simple to believe: not that he never failed, but that he learned not to let a single failure become the final word on who he was.",
                ],
                [
                    "Her discipline began with something very small and almost invisible: waking up thirty minutes earlier each day, just to sit quietly and write down the day's plan on paper. There was nothing remarkable about the habit at first — she herself often doubted its worth.",
                    "Yet that small habit outlasted every grand plan she had ever made before. Over the years, without her quite noticing, those thirty minutes became the foundation for nearly every important decision in her life — not because of what was written, but because of a consistency few people manage to keep.",
                    "Those around her often saw only the end result — the achievements, the recognition, the praise — without ever seeing the thousands of quiet mornings that came before, when there was no applause at all, and the only audience was herself, at the same desk, every single day.",
                    "She often said discipline isn't about blazing motivation, but about the willingness to show up on the days when that motivation is completely absent. A simple sentence, though it took her decades to truly understand it through experience rather than just hearing it from someone else.",
                ],
            ],
            'Pengembangan Diri' => [
                [
                    "Major change in life rarely begins with a dramatic, sweeping decision. It far more often starts with one small habit repeated consistently — five minutes of reading each night, one morning walk, one sentence of gratitude before bed — that, at first, feels far too small to matter at all.",
                    "The trouble is, most people give up on small habits like these precisely because the results aren't immediately visible. Yet like compound interest in a savings account, the impact of a small, consistent habit is only truly felt after being repeated long enough — often well past the point where most people have already given up trying.",
                    'There is one shift in perspective that helps here: instead of asking "what result do I want to achieve," it\'s more useful to ask "what kind of person do I want to become." Someone who reads every night will, sooner or later, become a reader. An identity built from small repetition is far more durable than momentary motivation, which fades easily.',
                    "In the end, personal growth isn't about becoming a completely different person overnight, but about becoming slightly better than yesterday's version of yourself, over and over, for long enough to let those small changes accumulate into something that truly, tangibly matters.",
                ],
                [
                    "The fear of doing something new rarely disappears completely, even in people who seem the most confident. What sets them apart isn't the absence of fear, but the habit of moving forward anyway — a skill that, like a muscle, can only be trained through repetition, not simply understood in theory.",
                    "Many people wait for confidence to arrive first before daring to try something new. Yet the order is often reversed: it's the small action taken despite fear that slowly builds confidence — not the other way around. Waiting for fear to vanish entirely before acting usually means waiting forever.",
                    "The scariest first step is usually also the smallest-looking one from the outside: sending one message, raising a hand once, signing up for one opportunity. Yet it's precisely that small step that separates a wish that only ever gets thought about from a wish that actually begins to be lived.",
                    "Over time, the courage to take these small steps accumulates into something larger: not fear disappearing entirely, but a growing trust that fear doesn't have to be the thing that decides whether a step is worth taking.",
                ],
            ],
            'Bisnis & Ekonomi' => [
                [
                    "A small shop tucked in the corner of a market survived more than two decades not because it had the cheapest products, but because its owner understood something big businesses often forget: customers come back not only for what they buy, but for the feeling of being cared for every time they walk in.",
                    "When an economic crisis hit and many similar businesses shut down, this small shop survived through a decision that made little sense to most business consultants: cutting profit margins to keep prices affordable for loyal customers, trusting that long-term relationships mattered more than short-term profit.",
                    "That decision, which looked risky and strategically unwise at the time, turned out to build a loyalty no marketing strategy could ever buy. Customers helped through hard times became the most devoted customers years later, even when competitors offered far cheaper prices.",
                    "This story holds a simple lesson about value in business: the numbers on a financial statement matter, but trust built through years of consistency often becomes an asset far harder for any competitor to copy, and far more resilient to the economic shocks that keep coming and going.",
                ],
                [
                    "Every business decision is, at its core, a bet on a future that can never be fully guaranteed. What sets an experienced entrepreneur apart from a beginner isn't the ability to eliminate that risk, but the ability to take carefully calculated risks, and the willingness to bear the worst outcome without losing direction.",
                    "Many great business opportunities actually emerge from problems that seem too small or too messy for anyone else to bother solving. Precisely because most people avoid them, the room to innovate there grows wider — a paradox often missed by those chasing only the latest popular trend.",
                    "Understanding risk well doesn't mean becoming recklessly bold, but becoming honest about the worst-case scenario that could happen, and preparing for it before ever taking the leap. Entrepreneurs who last aren't usually the most optimistic, but the most realistic while still being willing to try.",
                    "In the end, business and economics aren't just about numbers and charts, but about understanding human behavior — what people truly need, what makes them trust, and what makes them come back. Whoever understands this more deeply than their competitors is usually the one who lasts the longest.",
                ],
            ],
            'Agama & Spiritual' => [
                [
                    "In the middle of a fast-paced routine, there's a simple practice often forgotten: pausing for a moment, taking a deep breath, and truly noticing what there is to be grateful for right now — nothing grand or special, just the small things that usually go unnoticed for seeming too ordinary.",
                    "Inner peace rarely comes from the absence of problems, but from the ability to accept that life will always carry uncertainty, and choosing to feel enough in the midst of that uncertainty anyway. This isn't passive resignation, but a peace born from understanding that not everything is within our control.",
                    "Many spiritual traditions, each in their own way, teach something similar: that true happiness lies not in how much one has, but in how deeply one can feel gratitude for what already exists. It's an easy sentence to say, but one that takes a lifetime of practice to truly live.",
                    "Perhaps the peace so many people search for through so many different means is already available at every moment, waiting to be noticed in the small pauses within a busy life — one breath, one moment of gratitude, one recognition that this moment, imperfect as it is, is already enough to be thankful for.",
                ],
                [
                    "The most meaningful kindness is often not the grandest, but the most sincere — a small act of help given without expecting anything in return or any recognition, to someone who may never even know who helped them.",
                    "There is a particular strength in being willing to understand others without rushing to judge — listening to someone's story all the way through before drawing conclusions, imagining burdens they might be carrying that aren't visible from the outside. Empathy like this is rarely easy, especially toward people whose views differ from our own.",
                    "Many spiritual teachings agree on one point: that our relationships with fellow human beings mirror our relationship with something greater than ourselves. Tending to those relationships with patience and honesty is, then, not merely a social duty, but part of the inner journey itself.",
                    "In the end, the peace so many people seek is rarely found in complete solitude, but in sincere connection with others — in the willingness to be fully present for someone else, however simple the form, and to receive their presence back in the same way.",
                ],
            ],
            'Anak & Remaja' => [
                [
                    "At the far end of the backyard was a small patch of garden that a child visited every single morning, a worn notebook always in hand. She wrote down every new thing she found — a butterfly with wings she'd never seen before, the footprints of an animal she couldn't identify, or a cloud shaped, she thought, just like a ship.",
                    "One morning, she found something truly new: a small hole beneath the old mango tree, with tiny tracks around it she'd never recorded before. Instead of being scared, she grew even more curious, sitting quietly nearby for hours, waiting to see who the tracks belonged to.",
                    "Her patience paid off when a small rabbit finally emerged from its burrow, sniffing the air before hopping toward the bushes. She didn't chase it, only watched from a safe distance with a wide smile, then rushed to write down everything she'd seen before she could forget a single detail.",
                    "That night, she told her family all about her discovery at length, her eyes shining as if she'd just found buried treasure. To the grown-ups, it was just an ordinary rabbit. But to her, it was proof that the world around her house still held plenty of surprises, as long as she was patient enough to notice them.",
                ],
                [
                    "Three best friends always gathered under the big tree near the school field after class, discussing small plans they considered very important — from building a treehouse to solving the mystery of the strange noise that kept coming from the old shed down the road.",
                    "When one of them had to transfer to another school because her family was moving to a different city, the two friends left behind felt a loss so big it seemed like an important part of their routine had disappeared with her. They argued for a while about how to keep the friendship alive now that the distance between them had grown so much larger.",
                    "One of them had an idea: writing letters every week, sharing the small things that happened, just like they used to do under that big tree. It felt strange at first, writing letters in an age when everyone already had a phone, but over time the habit became the thing they looked forward to most each week.",
                    "Years later, all three still kept those letters in an old wooden box, proof that real friendship isn't measured by how close the distance is, but by how much effort is made to keep showing up for each other, however simple the way.",
                ],
            ],
            'Komik & Graphic Novel' => [
                [
                    "Dawn hadn't fully broken when a young student was already standing in the training yard, sweat soaking through a worn uniform. The teacher sat on the porch, watching in silence, occasionally correcting the student's stance with nothing more than a single short word, never praising, never quite satisfied.",
                    '"True strength," the teacher finally said, breaking the morning silence, "doesn\'t come from how hard you can strike, but from how many times you get back up after falling, with no one telling you to keep trying." The student said nothing, only nodded slowly while catching a still-ragged breath.',
                    "Training that day ended as it always did — no great victory, no dramatic breakthrough, just small improvements nearly invisible from the outside. But deep down, the student knew that improvements like these, repeated long enough, would one day become real strength.",
                    "When the sun finally rose fully over the eastern horizon, the student stood once more at the starting position, ready to repeat the same drill for the thousandth time. The path to true strength was still long, but for the first time, impatience gave way to something else — not a rush to arrive, but the beginning of enjoying every step of the journey itself.",
                ],
                [
                    "The small group stopped at the top of a hill, gazing out over unfamiliar land no one from their home village had ever set foot on. The map they carried was no longer much help — its edge ran blank, a sign they had gone farther than anyone had ever charted before.",
                    '"We can still turn back now," one of them said, voice trembling between exhaustion and fear. But the others shook their heads slowly, watching the horizon turn red with the coming dusk. This journey was no longer about reaching the destination they\'d planned at the start — it had become about who they would be after making it.',
                    "That night, around a small campfire, they shared their reasons for starting this journey in the first place — some out of necessity, some searching for something lost, and some simply because they had nowhere else left to go. But that night, for the first time, those reasons felt far less important than the simple fact that they were still together.",
                    "The next morning, the group continued down the hill, toward the unfamiliar land waiting ahead. No one knew for certain what they would find, but for the first time since the journey began, not knowing felt more like an adventure than a threat.",
                ],
            ],
            'Kesehatan & Gaya Hidup' => [
                [
                    "The human body rarely warns us dramatically when exhaustion has been building for too long — it tends to whisper instead, through small signs easy to dismiss: sleep that no longer feels like enough, focus that starts slipping, or a mood that flares more easily for no clear reason.",
                    "Many people only truly start paying attention to their bodies once these small signs grow into bigger problems, even though the body had actually been signaling long before that point. Learning to recognize these small signals — and having the courage to rest before being forced to stop entirely — is a skill rarely taught directly.",
                    "Rest, in many modern cultures, is often seen as a sign of laziness or a lack of ambition. Yet biologically, adequate rest is when the body repairs itself, consolidates memory, and restores the energy that determines the quality of the days ahead. Ignoring it isn't a sign of hard work, but a debt that sooner or later comes due.",
                    "Interestingly, the most productive people over the long run usually aren't the ones who work the longest without stopping, but the ones most disciplined about balancing work and rest. They treat sleep and downtime not as a reward after hard work, but as an equally essential part of the process itself.",
                ],
                [
                    "The movement most beneficial to health is often not the most intense, but the most consistently sustained over time — a short daily walk turns out to offer long-term benefits no less meaningful than intense exercise done only occasionally before being abandoned.",
                    "Many people fall into an up-and-down pattern: exercising intensely and enthusiastically for a few weeks, then stopping altogether from exhaustion or lost motivation. This pattern, while it feels productive in the short term, is actually less beneficial than a simple habit maintained without long gaps.",
                    "Caring for the body, at its core, resembles tending a long-term relationship far more than completing a project with a fixed deadline. It requires ongoing attention, not one explosive burst of effort followed by long stretches of complete neglect.",
                    "Small, consistent changes — enough sleep, moving a little every day, eating with more awareness — rarely feel dramatic in the short term. But like most things truly worth having in life, the results only become visible after being sustained long enough, well past the point where most people have already given up.",
                ],
            ],
        ];
    }
}
