<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('koleksi_pribadi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('buku_id')->constrained('buku')->cascadeOnDelete();
            $table->unsignedInteger('halaman_terakhir')->default(0)
                ->comment('bookmark posisi terakhir baca');
            $table->text('catatan_bacaan')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'buku_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('koleksi_pribadi');
    }
};
