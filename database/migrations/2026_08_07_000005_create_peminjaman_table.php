<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('peminjaman', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete()
                ->comment('anggota yang meminjam');
            $table->foreignId('buku_id')->constrained('buku')->cascadeOnDelete();
            $table->foreignId('petugas_id')->nullable()->constrained('users')->nullOnDelete()
                ->comment('petugas yang memproses approval/pengembalian');

            $table->dateTime('tanggal_pengajuan')->useCurrent();
            $table->date('tanggal_pinjam')->nullable();
            $table->date('tanggal_jatuh_tempo')->nullable();
            $table->date('tanggal_kembali')->nullable();

            $table->enum('status', [
                'menunggu_persetujuan',
                'disetujui',
                'ditolak',
                'dipinjam',
                'dikembalikan',
                'terlambat',
            ])->default('menunggu_persetujuan');

            $table->unsignedTinyInteger('jumlah_perpanjangan')->default(0);
            $table->enum('status_perpanjangan', ['tidak_ada', 'menunggu', 'disetujui', 'ditolak'])
                ->default('tidak_ada');

            $table->decimal('denda', 10, 2)->default(0);
            $table->enum('status_denda', ['belum_lunas', 'lunas'])->default('belum_lunas');

            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('peminjaman');
    }
};
