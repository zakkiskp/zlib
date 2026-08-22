<?php

namespace App\Http\Controllers;

use App\Models\Buku;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PetugasDataBukuController extends Controller
{
    public function index(Request $request)
    {
        $query = Buku::select(['id', 'judul_buku', 'penulis', 'cover_url', 'stok_tersedia', 'total_stok', 'kondisi']);

        if ($search = $request->string('q')->trim()->toString()) {
            $query->where('judul_buku', 'like', "%{$search}%");
        }

        $buku = $query->orderBy('judul_buku')->paginate(15)->withQueryString();

        return Inertia::render('Petugas/DataBuku', [
            'buku' => $buku,
            'filters' => $request->only(['q']),
        ]);
    }

    public function updateStok(Request $request, Buku $buku)
    {
        $validated = $request->validate([
            'stok_tersedia' => 'required|integer|min:0',
            'total_stok' => 'required|integer|min:0|gte:stok_tersedia',
        ]);

        $buku->update($validated);

        return back()->with('success', 'Stok buku berhasil diperbarui.');
    }
}
