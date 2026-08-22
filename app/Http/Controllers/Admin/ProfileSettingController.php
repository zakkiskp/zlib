<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use App\Services\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class ProfileSettingController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();

        return Inertia::render('Admin/Profile/Index', [
            'profile' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar_url' => $user->avatar_url,
            ],
            'settings' => [
                'site_name' => SystemSetting::get('site_name', 'Z-Lib'),
                'site_logo' => SystemSetting::get('site_logo'),
                'denda_per_hari' => (int) SystemSetting::get('denda_per_hari', 1000),
                'durasi_pinjam_maks' => (int) SystemSetting::get('durasi_pinjam_maks', 7),
                'maks_buku_dipinjam' => (int) SystemSetting::get('maks_buku_dipinjam', 3),
            ],
        ]);
    }

    /**
     * Tab Profil — update nama, email (@gmail.com), avatar.
     */
    public function updateProfile(Request $request): RedirectResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'regex:/^[a-zA-Z0-9._%+-]+@gmail\.com$/',
                'unique:users,email,' . $user->id,
            ],
            'avatar' => ['nullable', 'image', 'max:2048'],
        ], [
            'email.regex' => 'Email wajib menggunakan domain @gmail.com.',
        ]);

        $newAvatarPath = null;

        if ($request->hasFile('avatar')) {
            $newAvatarPath = $request->file('avatar')->store('avatars', 'public');

            // Hapus avatar lama HANYA kalau itu file lokal (bukan URL
            // eksternal seperti pravatar.cc dari data seed) — mencegah
            // Storage::delete() dipanggil dengan URL penuh sebagai path.
            if ($user->avatar_url && ! str_starts_with($user->avatar_url, 'http')) {
                Storage::disk('public')->delete($user->avatar_url);
            }
        }

        // Update name & email seperti biasa lewat Eloquent — bagian ini
        // sudah terbukti jalan (nama & email berhasil berubah sebelumnya).
        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->save();

        /**
         * FIX BUG #3 LANJUTAN (Avatar Admin MASIH gagal walau sudah
         * dipatch minggu lalu dengan set-properti-langsung + save()):
         *
         * Karena percobaan sebelumnya (langsung lewat Eloquent) ternyata
         * belum cukup, kemungkinan ada sesuatu di level app/Models/User.php
         * yang saya tidak punya visibilitasnya — accessor/mutator custom,
         * atau observer yang ikut campur saat save() dipanggil pada model
         * User (mis. observer yang menimpa balik avatar_url dari sumber
         * lain). Supaya avatar_url DIJAMIN tersimpan terlepas dari
         * apapun yang terjadi di level model, baris ini menulis LANGSUNG
         * ke tabel `users` lewat Query Builder — melewati Eloquent
         * sepenuhnya (tidak lewat $fillable, mutator, ataupun observer).
         *
         * Ini "obat keras" yang seharusnya menuntaskan gejalanya sekarang.
         * TAPI kalau ternyata observer itu memang sengaja dipasang untuk
         * alasan lain (bukan bug), baris ini akan melewatinya begitu saja
         * tanpa Anda sadari. Kalau masih ada perilaku aneh setelah patch
         * ini, itu tandanya saya perlu lihat isi app/Models/User.php
         * langsung untuk mencari observer/mutator yang dimaksud.
         */
        if ($newAvatarPath) {
            DB::table('users')->where('id', $user->id)->update([
                'avatar_url' => $newAvatarPath,
                'updated_at' => now(),
            ]);
        }

        AuditLogger::log('update', 'profil', "Admin {$user->name} memperbarui data profil.");

        return back()->with('success', 'Profil berhasil diperbarui.');
    }

    /**
     * Tab Profil — ganti password.
     */
    public function updatePassword(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user = Auth::user();
        $user->update(['password' => Hash::make($validated['password'])]);

        AuditLogger::log('update', 'profil', "Admin {$user->name} mengganti password.");

        return back()->with('success', 'Password berhasil diganti.');
    }

    /**
     * Tab Sistem — nama web, logo, tarif denda, durasi maksimal pinjam.
     */
    public function updateSystemSettings(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'site_name' => ['required', 'string', 'max:100'],
            'site_logo' => ['nullable', 'image', 'max:1024'],
            'denda_per_hari' => ['required', 'integer', 'min:0'],
            'durasi_pinjam_maks' => ['required', 'integer', 'min:1', 'max:60'],
            'maks_buku_dipinjam' => ['required', 'integer', 'min:1', 'max:20'],
        ]);

        SystemSetting::set('site_name', $validated['site_name']);
        SystemSetting::set('denda_per_hari', $validated['denda_per_hari']);
        SystemSetting::set('durasi_pinjam_maks', $validated['durasi_pinjam_maks']);
        SystemSetting::set('maks_buku_dipinjam', $validated['maks_buku_dipinjam']);

        if ($request->hasFile('site_logo')) {
            $path = $request->file('site_logo')->store('branding', 'public');
            SystemSetting::set('site_logo', $path);
        }

        AuditLogger::log('update', 'sistem', 'Admin memperbarui konfigurasi sistem Z-Lib.');

        return back()->with('success', 'Pengaturan sistem berhasil disimpan.');
    }
}
