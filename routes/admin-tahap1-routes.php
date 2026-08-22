<?php

/**
 * ==============================================================
 * TAMBAHKAN SNIPPET INI KE routes/web.php ANDA
 * ==============================================================
 *
 * 1) Tambahkan use statement berikut di bagian atas routes/web.php
 *    (bersama use statement controller lain yang sudah ada):
 *
 *    use App\Http\Controllers\Admin\ProfileSettingController;
 *    use App\Http\Controllers\Admin\AuditLogController;
 *    use App\Http\Controllers\Admin\AnnouncementController;
 *    use App\Http\Controllers\Admin\ReportController;
 *
 * 2) Tempelkan route di bawah ini KE DALAM group admin yang sudah ada
 *    dari Langkah 8 (Route::middleware(['auth','role:admin'])->prefix('admin')...),
 *    JANGAN buat group baru yang terpisah.
 */

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {

    // ... route Master Data Buku, Kategori, User Management dari Langkah 8
    //     tetap berada di sini, tidak diubah ...

    // ── TAHAP 1: Profil Admin & Core System Settings ──────────────
    Route::get('/profil', [ProfileSettingController::class, 'index'])->name('profile');
    Route::put('/profil', [ProfileSettingController::class, 'updateProfile'])->name('profile.update');
    Route::put('/profil/password', [ProfileSettingController::class, 'updatePassword'])->name('profile.password');
    Route::put('/pengaturan-sistem', [ProfileSettingController::class, 'updateSystemSettings'])->name('settings.update');

    // ── TAHAP 1: Audit Log Viewer ──────────────────────────────────
    Route::get('/audit-log', [AuditLogController::class, 'index'])->name('audit-log');

    // ── TAHAP 1: Pengumuman Manager (CRUD) ─────────────────────────
    Route::get('/pengumuman', [AnnouncementController::class, 'index'])->name('announcements');
    Route::post('/pengumuman', [AnnouncementController::class, 'store'])->name('announcements.store');
    Route::put('/pengumuman/{announcement}', [AnnouncementController::class, 'update'])->name('announcements.update');
    Route::delete('/pengumuman/{announcement}', [AnnouncementController::class, 'destroy'])->name('announcements.destroy');

    // ── TAHAP 1: Laporan & BI Report Generator ─────────────────────
    Route::get('/laporan', [ReportController::class, 'index'])->name('reports');
    Route::get('/laporan/export/pdf', [ReportController::class, 'exportPdf'])->name('reports.pdf');
    Route::get('/laporan/export/excel', [ReportController::class, 'exportExcel'])->name('reports.excel');
});
