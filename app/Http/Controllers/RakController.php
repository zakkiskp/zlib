<?php

namespace App\Http\Controllers;

use App\Models\KategoriBuku;
use App\Models\Rak;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RakController extends Controller
{
    public function index()
    {
        return Inertia::render('Petugas/KategoriRak', [
            'raks' => Rak::withCount('buku')->orderBy('kode_rak')->get(),
            'kategori' => KategoriBuku::withCount('buku')->orderBy('nama_kategori')->get(),
        ]);
    }

    public function storeRak(Request $request)
    {
        $validated = $request->validate([
            'kode_rak' => 'required|string|max:255|unique:raks,kode_rak',
            'lokasi' => 'required|string|max:255',
            'keterangan' => 'nullable|string|max:255',
            'kapasitas' => 'required|integer|min:1',
        ]);

        Rak::create($validated);

        return back()->with('success', 'Rak baru ditambahkan.');
    }

    public function updateRak(Request $request, Rak $rak)
    {
        $validated = $request->validate([
            'kode_rak' => 'required|string|max:255|unique:raks,kode_rak,' . $rak->id,
            'lokasi' => 'required|string|max:255',
            'keterangan' => 'nullable|string|max:255',
            'kapasitas' => 'required|integer|min:1',
        ]);

        $rak->update($validated);

        return back()->with('success', 'Rak berhasil diperbarui.');
    }

    public function destroyRak(Rak $rak)
    {
        if ($rak->buku()->exists()) {
            return back()->withErrors(['rak' => 'Rak masih dipakai oleh buku, pindahkan dulu bukunya.']);
        }

        $rak->delete();

        return back()->with('success', 'Rak dihapus.');
    }
}
