<?php

namespace App\Http\Controllers;

use App\Models\KategoriBuku;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminKategoriController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Kategori/Index', [
            'kategori' => KategoriBuku::withCount('buku')->orderBy('nama_kategori')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_kategori' => 'required|string|max:255|unique:kategori_buku,nama_kategori',
            'deskripsi' => 'nullable|string|max:500',
        ]);

        $validated['slug'] = Str::slug($validated['nama_kategori']);

        KategoriBuku::create($validated);

        return back()->with('success', 'Kategori baru ditambahkan.');
    }

    public function update(Request $request, KategoriBuku $kategori)
    {
        $validated = $request->validate([
            'nama_kategori' => 'required|string|max:255|unique:kategori_buku,nama_kategori,' . $kategori->id,
            'deskripsi' => 'nullable|string|max:500',
        ]);

        $validated['slug'] = Str::slug($validated['nama_kategori']);

        $kategori->update($validated);

        return back()->with('success', 'Kategori diperbarui.');
    }

    public function destroy(KategoriBuku $kategori)
    {
        if ($kategori->buku()->exists()) {
            return back()->withErrors(['kategori' => 'Kategori masih dipakai buku, tidak bisa dihapus.']);
        }

        $kategori->delete();

        return back()->with('success', 'Kategori dihapus.');
    }
}
