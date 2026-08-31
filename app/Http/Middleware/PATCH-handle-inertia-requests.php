<?php

/**
 * ==============================================================
 * PATCH app/Http/Middleware/HandleInertiaRequests.php ANDA
 * ==============================================================
 *
 * Saya tidak punya isi file ini (tidak pernah diupload), jadi ini snippet
 * untuk digabung manual — bukan file utuh untuk menimpa.
 *
 * Buka method share() di HandleInertiaRequests.php Anda. Method itu me-return
 * array (biasanya sudah ada 'auth' => [...] di dalamnya). TAMBAHKAN key baru
 * ini sejajar dengan 'auth':
 */

// public function share(Request $request): array
// {
//     return [
//         ...parent::share($request),
//
//         'auth' => [
//             // ... yang sudah ada, jangan diubah ...
//         ],
//
//         // TAMBAHAN BARU — pengumuman aktif, khusus untuk role Anggota.
//         // Pakai closure supaya query cuma jalan kalau memang dibutuhkan
//         // (lazy evaluation, praktik yang direkomendasikan Inertia).
//         'activeAnnouncements' => function () use ($request) {
//             $user = $request->user();
//
//             if (! $user || $user->role !== 'anggota') {
//                 return [];
//             }
//
//             return \App\Models\Announcement::active()
//                 ->orderByDesc('created_at')
//                 ->get(['id', 'title', 'content', 'banner_image', 'type', 'created_at']);
//         },
//     ];
// }

/**
 * Setelah ditambahkan, prop `activeAnnouncements` otomatis tersedia di
 * SEMUA halaman Anggota lewat usePage().props.activeAnnouncements — itu
 * yang dibaca oleh resources/js/Components/AnnouncementBanner.jsx.
 *
 * Method scopeActive() sudah ada dari Tahap 1 di app/Models/Announcement.php
 * (filter is_active=true + dalam rentang start_date/end_date) — tidak perlu
 * ada yang diubah di model.
 */
