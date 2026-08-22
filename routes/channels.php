<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Di sinilah semua channel broadcast event di-daftarkan untuk aplikasi
| kamu. Semua channel yang terdaftar otomatis di-otorisasi lewat
| BroadcastServiceProvider bawaan Laravel.
|
*/

// Setiap user cuma bisa dengerin channel notifikasi miliknya sendiri
Broadcast::channel('notifikasi.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

// Cuma petugas & admin yang boleh dengerin antrean Circulation Desk
Broadcast::channel('circulation-desk', function ($user) {
    return in_array($user->role, ['petugas', 'admin']);
});
