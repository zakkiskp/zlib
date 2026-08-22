<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ulasan_buku', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('buku_id')->constrained('buku')->cascadeOnDelete();
            $table->unsignedTinyInteger('rating')->comment('1-5');
            $table->text('komentar')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'buku_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ulasan_buku');
    }
};
