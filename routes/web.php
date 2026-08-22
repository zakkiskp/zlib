<?php

use App\Http\Controllers\AdminBukuController;
use App\Http\Controllers\AdminKategoriController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DendaController;
use App\Http\Controllers\KatalogController;
use App\Http\Controllers\KoleksiPribadiController;
use App\Http\Controllers\LaporanSirkulasiController;
use App\Http\Controllers\NotifikasiController;
use App\Http\Controllers\PeminjamanController;
use App\Http\Controllers\PetugasDataBukuController;
use App\Http\Controllers\PetugasQrScannerController; // <-- TAMBAHAN 1: Import Controller QR Scanner
use App\Http\Controllers\PreservasiController;
use App\Http\Controllers\ProfilController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RakController;
use App\Http\Controllers\UlasanController;
use Illuminate\Support\Facades\Route;

// --- TAMBAHAN IMPORT UNTUK TAHAP 1 ---
use App\Http\Controllers\Admin\ProfileSettingController;
use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\AnnouncementController;
use App\Http\Controllers\Admin\ReportController;

Route::get('/', function () {
    return redirect()->route(auth()->check() ? 'dashboard' : 'login');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // ================= SEMUA ROLE (auth aja) =================
    Route::get('/katalog', [KatalogController::class, 'index'])->name('katalog.index');
    Route::get('/katalog/{buku}', [KatalogController::class, 'show'])->name('katalog.show');
    Route::get('/katalog/{buku}/baca', [KatalogController::class, 'baca'])->name('katalog.baca');
    Route::post('/katalog/{buku}/bookmark', [KatalogController::class, 'updateBookmark'])->name('katalog.bookmark');
    Route::post('/katalog/{buku}/ulasan', [UlasanController::class, 'store'])->name('ulasan.store');

    Route::post('/peminjaman', [PeminjamanController::class, 'store'])->name('peminjaman.store');
    Route::get('/peminjaman-saya', [PeminjamanController::class, 'saya'])->name('peminjaman.saya');
    Route::post('/peminjaman/{peminjaman}/perpanjang', [PeminjamanController::class, 'perpanjang'])->name('peminjaman.perpanjang');

    Route::get('/koleksi-pribadi', [KoleksiPribadiController::class, 'index'])->name('koleksi-pribadi.index');
    Route::post('/koleksi-pribadi/{buku}/toggle', [KoleksiPribadiController::class, 'toggle'])->name('koleksi-pribadi.toggle');

    Route::get('/ulasan-saya', [UlasanController::class, 'saya'])->name('ulasan.saya');
    Route::delete('/ulasan/{ulasan}', [UlasanController::class, 'destroy'])->name('ulasan.destroy');

    Route::get('/profil', [ProfilController::class, 'index'])->name('profil.index');
    Route::patch('/profil', [ProfilController::class, 'update'])->name('profil.update');
    Route::post('/profil/avatar', [ProfilController::class, 'updateAvatar'])->name('profil.avatar');

    Route::get('/notifikasi', [NotifikasiController::class, 'index'])->name('notifikasi.index');
    Route::post('/notifikasi/tandai-semua', [NotifikasiController::class, 'markAllRead'])->name('notifikasi.tandai-semua');
    Route::post('/notifikasi/{notifikasi}/tandai', [NotifikasiController::class, 'markAsRead'])->name('notifikasi.tandai');

    // ================= PETUGAS & ADMIN =================
    Route::middleware('role:petugas,admin')->group(function () {
        Route::get('/circulation-desk', [PeminjamanController::class, 'circulationDesk'])->name('circulation-desk');
        Route::post('/peminjaman/{peminjaman}/approve', [PeminjamanController::class, 'approve'])->name('peminjaman.approve');
        Route::post('/peminjaman/{peminjaman}/reject', [PeminjamanController::class, 'reject'])->name('peminjaman.reject');
        Route::post('/peminjaman/{peminjaman}/kembalikan', [PeminjamanController::class, 'kembalikan'])->name('peminjaman.kembalikan');
        Route::post('/peminjaman/{peminjaman}/perpanjangan/approve', [PeminjamanController::class, 'approvePerpanjangan'])->name('peminjaman.perpanjangan.approve');
        Route::post('/peminjaman/{peminjaman}/perpanjangan/reject', [PeminjamanController::class, 'rejectPerpanjangan'])->name('peminjaman.perpanjangan.reject');

        Route::get('/data-buku', [PetugasDataBukuController::class, 'index'])->name('petugas.data-buku');
        Route::patch('/data-buku/{buku}/stok', [PetugasDataBukuController::class, 'updateStok'])->name('petugas.data-buku.stok');

        Route::get('/kategori-rak', [RakController::class, 'index'])->name('petugas.kategori-rak');
        Route::post('/rak', [RakController::class, 'storeRak'])->name('rak.store');
        Route::patch('/rak/{rak}', [RakController::class, 'updateRak'])->name('rak.update');
        Route::delete('/rak/{rak}', [RakController::class, 'destroyRak'])->name('rak.destroy');

        Route::get('/preservasi-buku', [PreservasiController::class, 'index'])->name('petugas.preservasi');
        Route::patch('/preservasi-buku/{buku}/kondisi', [PreservasiController::class, 'updateKondisi'])->name('petugas.preservasi.kondisi');
        Route::post('/preservasi-buku/usulan', [PreservasiController::class, 'storeUsulan'])->name('petugas.preservasi.usulan');

        Route::get('/pengelolaan-denda', [DendaController::class, 'index'])->name('petugas.denda');
        Route::post('/pengelolaan-denda/{peminjaman}/lunas', [DendaController::class, 'markLunas'])->name('petugas.denda.lunas');

        Route::get('/laporan-sirkulasi', [LaporanSirkulasiController::class, 'index'])->name('petugas.laporan');

        // --- TAMBAHAN 2: Rute QR Scanner untuk Petugas (Sesuai Patch Tahap 2) ---
        Route::get('/petugas/qr-scanner', [PetugasQrScannerController::class, 'index'])->name('petugas.qr-scanner');
        Route::post('/petugas/qr-scanner/proses', [PetugasQrScannerController::class, 'process'])->name('petugas.qr-scanner.proses');
    });

    // ================= ADMIN ONLY =================
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/buku', [AdminBukuController::class, 'index'])->name('admin.buku.index');
        Route::get('/buku/create', [AdminBukuController::class, 'create'])->name('admin.buku.create');
        Route::post('/buku', [AdminBukuController::class, 'store'])->name('admin.buku.store');
        Route::get('/buku/{buku}/edit', [AdminBukuController::class, 'edit'])->name('admin.buku.edit');
        Route::put('/buku/{buku}', [AdminBukuController::class, 'update'])->name('admin.buku.update');
        Route::delete('/buku/{buku}', [AdminBukuController::class, 'destroy'])->name('admin.buku.destroy');
        Route::post('/buku/{buku}/cover', [AdminBukuController::class, 'uploadCover'])->name('admin.buku.cover');
        Route::post('/buku/{buku}/pdf', [AdminBukuController::class, 'uploadPdf'])->name('admin.buku.pdf');

        Route::get('/kategori', [AdminKategoriController::class, 'index'])->name('admin.kategori.index');
        Route::post('/kategori', [AdminKategoriController::class, 'store'])->name('admin.kategori.store');
        Route::patch('/kategori/{kategori}', [AdminKategoriController::class, 'update'])->name('admin.kategori.update');
        Route::delete('/kategori/{kategori}', [AdminKategoriController::class, 'destroy'])->name('admin.kategori.destroy');

        Route::get('/user', [AdminUserController::class, 'index'])->name('admin.user.index');
        Route::patch('/user/{user}/role', [AdminUserController::class, 'updateRole'])->name('admin.user.role');
        Route::patch('/user/{user}/status', [AdminUserController::class, 'updateStatus'])->name('admin.user.status');
        Route::post('/user/{user}/reset-password', [AdminUserController::class, 'resetPassword'])->name('admin.user.reset-password');

        // --- RUTE TAHAP 1 ---
        Route::get('/profil', [ProfileSettingController::class, 'index'])->name('admin.profile');
        Route::put('/profil', [ProfileSettingController::class, 'updateProfile'])->name('admin.profile.update');
        Route::put('/profil/password', [ProfileSettingController::class, 'updatePassword'])->name('admin.profile.password');
        Route::put('/pengaturan-sistem', [ProfileSettingController::class, 'updateSystemSettings'])->name('admin.settings.update');

        Route::get('/audit-log', [AuditLogController::class, 'index'])->name('admin.audit-log');

        Route::get('/pengumuman', [AnnouncementController::class, 'index'])->name('admin.announcements');
        Route::post('/pengumuman', [AnnouncementController::class, 'store'])->name('admin.announcements.store');
        Route::put('/pengumuman/{announcement}', [AnnouncementController::class, 'update'])->name('admin.announcements.update');
        Route::delete('/pengumuman/{announcement}', [AnnouncementController::class, 'destroy'])->name('admin.announcements.destroy');

        Route::get('/laporan', [ReportController::class, 'index'])->name('admin.reports');
        Route::get('/laporan/export/pdf', [ReportController::class, 'exportPdf'])->name('admin.reports.pdf');
        Route::get('/laporan/export/excel', [ReportController::class, 'exportExcel'])->name('admin.reports.excel');
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';