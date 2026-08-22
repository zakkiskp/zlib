<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProfilController extends Controller
{
    public function index()
    {
        return Inertia::render('Profil/Index', [
            'user' => Auth::user(),
        ]);
    }

    public function update(Request $request)
    {
        $rules = [
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'alamat' => 'nullable|string|max:500',
        ];

        if ($request->user()->role === 'petugas') {
            $rules['shift_kerja'] = 'nullable|in:pagi,siang,malam';
        }

        $validated = $request->validate($rules);

        $request->user()->update($validated);

        return back()->with('success', 'Profil berhasil diperbarui.');
    }

    /**
     * Butuh `php artisan storage:link` supaya storage/app/public bisa
     * diakses browser lewat public/storage.
     */
    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|max:2048',
        ]);

        $user = $request->user();
        $path = $request->file('avatar')->store('avatars', 'public');

        $user->update(['avatar_url' => Storage::url($path)]);

        return back()->with('success', 'Foto profil berhasil diganti.');
    }
}
