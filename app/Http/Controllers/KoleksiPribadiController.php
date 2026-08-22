<?php

namespace App\Http\Controllers;

use App\Models\Buku;
use App\Models\KoleksiPribadi;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class KoleksiPribadiController extends Controller
{
    public function index()
    {
        $koleksi = KoleksiPribadi::with('buku:id,judul_buku,penulis,cover_url,rating_rata_rata')
            ->where('user_id', Auth::id())
            ->where('is_favorit', true)
            ->latest()
            ->get();

        return Inertia::render('KoleksiPribadi/Index', [
            'koleksi' => $koleksi,
        ]);
    }

    /**
     * Toggle favorit. Kalau row koleksi_pribadi sudah ada (misal karena
     * user pernah nyimpen bookmark bacaan), yang diubah cuma flag
     * is_favorit-nya — progres bacaan (halaman_terakhir, catatan_bacaan)
     * TIDAK ikut kehapus.
     */
    public function toggle(Buku $buku)
    {
        $existing = KoleksiPribadi::where('user_id', Auth::id())->where('buku_id', $buku->id)->first();

        if ($existing) {
            $existing->update(['is_favorit' => ! $existing->is_favorit]);
        } else {
            KoleksiPribadi::create([
                'user_id' => Auth::id(),
                'buku_id' => $buku->id,
                'is_favorit' => true,
            ]);
        }

        return back();
    }
}
