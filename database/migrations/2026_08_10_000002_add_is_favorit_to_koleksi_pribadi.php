<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * is_favorit terpisah dari halaman_terakhir/catatan_bacaan supaya
     * "menyimpan ke koleksi" (favorit) tidak menghapus progres bacaan
     * kalau suatu saat di-unfavorite.
     */
    public function up(): void
    {
        Schema::table('koleksi_pribadi', function (Blueprint $table) {
            $table->boolean('is_favorit')->default(false)->after('buku_id');
        });
    }

    public function down(): void
    {
        Schema::table('koleksi_pribadi', function (Blueprint $table) {
            $table->dropColumn('is_favorit');
        });
    }
};
