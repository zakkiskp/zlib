<?php

namespace App\Http\Controllers;

use App\Models\Buku;
use App\Models\Peminjaman;
use App\Models\UlasanBuku;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UlasanController extends Controller
{
    public function saya()
    {
        $ulasan = UlasanBuku::with('buku:id,judul_buku,cover_url,penulis')
            ->where('user_id', Auth::id())
            ->latest()
            ->paginate(10);

        return Inertia::render('Ulasan/Saya', [
            'ulasan' => $ulasan,
        ]);
    }

    /**
     * Dipakai juga untuk EDIT — karena tabel ulasan_buku unique per
     * (user_id, buku_id), updateOrCreate otomatis meng-update ulasan
     * lama kalau user submit ulang untuk buku yang sama.
     */
    public function store(Request $request, Buku $buku)
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'komentar' => 'nullable|string|max:1000',
        ]);

        $pernahPinjam = Peminjaman::where('user_id', Auth::id())
            ->where('buku_id', $buku->id)
            ->whereIn('status', ['dipinjam', 'terlambat', 'dikembalikan'])
            ->exists();

        if (! $pernahPinjam) {
            return back()->withErrors(['ulasan' => 'Kamu harus meminjam buku ini dulu sebelum bisa memberi ulasan.']);
        }

        UlasanBuku::updateOrCreate(
            ['user_id' => Auth::id(), 'buku_id' => $buku->id],
            $validated,
        );

        $this->perbaruiRatingBuku($buku);

        return back()->with('success', 'Ulasan berhasil disimpan.');
    }

    public function destroy(UlasanBuku $ulasan)
    {
        abort_unless($ulasan->user_id === Auth::id(), 403);

        $buku = $ulasan->buku;
        $ulasan->delete();
        $this->perbaruiRatingBuku($buku);

        return back()->with('success', 'Ulasan dihapus.');
    }

    private function perbaruiRatingBuku(Buku $buku): void
    {
        $agregat = UlasanBuku::where('buku_id', $buku->id)
            ->selectRaw('AVG(rating) as rata, COUNT(*) as total')
            ->first();

        $buku->update([
            'rating_rata_rata' => round($agregat->rata ?? 0, 1),
            'jumlah_ulasan' => $agregat->total ?? 0,
        ]);
    }
}
