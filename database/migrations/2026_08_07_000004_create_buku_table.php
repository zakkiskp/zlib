<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * v2: tahun_terbit pakai unsignedSmallInteger (bukan year()) supaya
     * bisa nampung buku klasik terbitan sebelum 1901 — tipe YEAR bawaan
     * MySQL cuma mendukung 1901-2155, kejadian nyata pas nyoba masukin
     * "Pride and Prejudice" (1813) lewat migration data.
     */
    public function up(): void
    {
        Schema::create('buku', function (Blueprint $table) {
            $table->id();
            $table->string('judul_buku');
            $table->string('penulis');
            $table->string('penerbit')->nullable();
            $table->unsignedSmallInteger('tahun_terbit')->nullable();
            $table->string('isbn', 20)->unique()->nullable();

            $table->foreignId('rak_id')->nullable()->constrained('raks')->nullOnDelete();

            $table->text('deskripsi')->nullable();
            $table->string('cover_url')->nullable();
            $table->string('file_pdf_url')->nullable();
            $table->string('bahasa', 50)->default('Indonesia');
            $table->unsignedInteger('jumlah_halaman')->nullable();

            $table->unsignedInteger('stok_tersedia')->default(0);
            $table->unsignedInteger('total_stok')->default(0);
            $table->decimal('rating_rata_rata', 2, 1)->default(0);
            $table->unsignedInteger('jumlah_ulasan')->default(0);

            $table->enum('kondisi', ['baik', 'rusak', 'hilang'])->default('baik');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('buku');
    }
};
