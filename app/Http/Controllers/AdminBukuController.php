<?php

namespace App\Http\Controllers;

use App\Models\Buku;
use App\Models\KategoriBuku;
use App\Models\Rak;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AdminBukuController extends Controller
{
    public function index(Request $request)
    {
        $query = Buku::with('kategoris:id,nama_kategori')
            ->select(['id', 'judul_buku', 'penulis', 'penerbit', 'tahun_terbit', 'isbn', 'cover_url', 'file_pdf_url', 'stok_tersedia', 'total_stok', 'kondisi']);

        if ($search = $request->string('q')->trim()->toString()) {
            $query->where('judul_buku', 'like', "%{$search}%");
        }

        $buku = $query->orderByDesc('created_at')->paginate(10)->withQueryString();

        return Inertia::render('Admin/Buku/Index', [
            'buku' => $buku,
            'filters' => $request->only(['q']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Buku/Form', [
            'buku' => null,
            'kategoriList' => KategoriBuku::orderBy('nama_kategori')->get(['id', 'nama_kategori']),
            'rakList' => Rak::orderBy('kode_rak')->get(['id', 'kode_rak', 'lokasi']),
        ]);
    }

    public function edit(Buku $buku)
    {
        $buku->load('kategoris:id');

        return Inertia::render('Admin/Buku/Form', [
            'buku' => $buku,
            'kategoriList' => KategoriBuku::orderBy('nama_kategori')->get(['id', 'nama_kategori']),
            'rakList' => Rak::orderBy('kode_rak')->get(['id', 'kode_rak', 'lokasi']),
        ]);
    }

    private function validated(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'judul_buku' => 'required|string|max:255',
            'penulis' => 'required|string|max:255',
            'penerbit' => 'nullable|string|max:255',
            'tahun_terbit' => 'nullable|integer|min:0|max:' . (now()->year + 1),
            'isbn' => ['nullable', 'string', 'max:20', Rule::unique('buku', 'isbn')->ignore($ignoreId)],
            'deskripsi' => 'nullable|string|max:2000',
            'bahasa' => 'nullable|string|max:50',
            'jumlah_halaman' => 'nullable|integer|min:0',
            'total_stok' => 'required|integer|min:0',
            'stok_tersedia' => 'required|integer|min:0|lte:total_stok',
            'kondisi' => 'required|in:baik,rusak,hilang',
            'rak_id' => 'nullable|exists:raks,id',
            'kategori_ids' => 'required|array|min:1',
            'kategori_ids.*' => 'exists:kategori_buku,id',
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validated($request);
        $kategoriIds = $validated['kategori_ids'];
        unset($validated['kategori_ids']);
        $validated['created_by'] = Auth::id();

        $buku = Buku::create($validated);
        $buku->kategoris()->sync($kategoriIds);

        return redirect("/admin/buku/{$buku->id}/edit")->with('success', 'Buku baru ditambahkan. Sekarang unggah cover & file PDF-nya.');
    }

    public function update(Request $request, Buku $buku)
    {
        $validated = $this->validated($request, $buku->id);
        $kategoriIds = $validated['kategori_ids'];
        unset($validated['kategori_ids']);

        $buku->update($validated);
        $buku->kategoris()->sync($kategoriIds);

        return back()->with('success', 'Buku berhasil diperbarui.');
    }

    public function destroy(Buku $buku)
    {
        $buku->delete();

        return back()->with('success', 'Buku dihapus.');
    }

    public function uploadCover(Request $request, Buku $buku)
    {
        $request->validate(['cover' => 'required|image|max:4096']);

        $path = $request->file('cover')->store('covers', 'public');
        $buku->update(['cover_url' => Storage::url($path)]);

        return back()->with('success', 'Cover buku berhasil diunggah.');
    }

    public function uploadPdf(Request $request, Buku $buku)
    {
        $request->validate(['pdf' => 'required|mimes:pdf|max:20480']);

        $path = $request->file('pdf')->store('buku-pdf', 'public');
        $buku->update(['file_pdf_url' => Storage::url($path)]);

        return back()->with('success', 'File PDF berhasil diunggah — sekarang buku ini bisa dibaca online.');
    }
}
