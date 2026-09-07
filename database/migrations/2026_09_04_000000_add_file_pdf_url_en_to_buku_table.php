<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * FIX BUG (isi bacaan PDF tidak ikut i18n): sebelumnya hanya ada 1 kolom
 * file_pdf_url (versi Bahasa Indonesia). Supaya konten BACAAN (bukan cuma
 * chrome UI React di sekitarnya) benar-benar ikut berganti saat tombol
 * ID/EN ditekan, kita perlu 2 file PDF terpisah per buku — satu per
 * bahasa — dan frontend memilih salah satunya sesuai bahasa aktif.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('buku', function (Blueprint $table) {
            $table->string('file_pdf_url_en')->nullable()->after('file_pdf_url');
        });
    }

    public function down(): void
    {
        Schema::table('buku', function (Blueprint $table) {
            $table->dropColumn('file_pdf_url_en');
        });
    }
};
