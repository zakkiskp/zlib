<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('user_name')->nullable(); // snapshot nama, tetap ada walau user dihapus
            $table->string('user_role', 20)->nullable();
            $table->string('action', 50); // create, update, delete, login, logout, approve, reject, export
            $table->string('module', 50); // buku, kategori, user, denda, pengumuman, sistem, profil, laporan, dll
            $table->text('description');
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['module', 'action']);
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
