<?php

namespace App\Http\Controllers;

use App\Models\Buku;
use App\Models\KategoriBuku;
use App\Models\KoleksiPribadi;
use App\Models\Peminjaman;
use App\Models\UlasanBuku;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class KatalogController extends Controller
{
    public function index(Request $request)
    {
        $query = Buku::with('kategoris:id,nama_kategori')
            ->withExists(['koleksiPribadi as is_favorit' => function ($q) {
                $q->where('user_id', Auth::id())->where('is_favorit', true);
            }])
            ->select([
                'id', 'judul_buku', 'penulis', 'penerbit', 'tahun_terbit',
                'cover_url', 'rating_rata_rata', 'jumlah_ulasan', 'stok_tersedia', 'total_stok',
            ]);

        if ($search = $request->string('q')->trim()->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('judul_buku', 'like', "%{$search}%")
                    ->orWhere('penulis', 'like', "%{$search}%");
            });
        }

        if ($kategoriId = $request->integer('kategori')) {
            $query->whereHas('kategoris', fn ($q) => $q->where('kategori_buku.id', $kategoriId));
        }

        $buku = $query->orderBy('judul_buku')->paginate(12)->withQueryString();

        return Inertia::render('Katalog/Index', [
            'buku' => $buku,
            'kategoriList' => KategoriBuku::orderBy('nama_kategori')->get(['id', 'nama_kategori']),
            'filters' => $request->only(['q', 'kategori']),
        ]);
    }

    /**
     * Dipanggil via fetch() dari BookDetailModal (bukan kunjungan halaman Inertia),
     * karena detail buku ditampilkan di modal, bukan pindah halaman.
     */
    public function show(Buku $buku)
    {
        $buku->load(['kategoris:id,nama_kategori', 'rak:id,kode_rak,lokasi']);
        $buku->loadExists(['koleksiPribadi as is_favorit' => function ($q) {
            $q->where('user_id', Auth::id())->where('is_favorit', true);
        }]);

        $ulasan = UlasanBuku::with('user:id,name,avatar_url')
            ->where('buku_id', $buku->id)
            ->latest()
            ->take(10)
            ->get()
            ->map(fn ($u) => [
                'id' => $u->id,
                'nama' => $u->user->name ?? '—',
                'avatar' => $u->user->avatar_url ?? null,
                'rating' => $u->rating,
                'komentar' => $u->komentar,
                'waktu' => $u->created_at->diffForHumans(),
            ]);

        $koleksi = Auth::check()
            ? KoleksiPribadi::where('user_id', Auth::id())->where('buku_id', $buku->id)->first()
            : null;

        $sudahDiajukan = Auth::check()
            ? Peminjaman::where('user_id', Auth::id())
                ->where('buku_id', $buku->id)
                ->whereIn('status', ['menunggu_persetujuan', 'disetujui', 'dipinjam'])
                ->exists()
            : false;

        $bisaUlasan = Auth::check()
            ? Peminjaman::where('user_id', Auth::id())
                ->where('buku_id', $buku->id)
                ->whereIn('status', ['dipinjam', 'terlambat', 'dikembalikan'])
                ->exists()
            : false;

        $ulasanSaya = Auth::check()
            ? UlasanBuku::where('user_id', Auth::id())->where('buku_id', $buku->id)->first()
            : null;

        return response()->json([
            'buku' => $buku,
            'ulasan' => $ulasan,
            'halamanTerakhir' => $koleksi->halaman_terakhir ?? 0,
            'catatanBacaan' => $koleksi->catatan_bacaan ?? '',
            'sudahDiajukan' => $sudahDiajukan,
            'bisaUlasan' => $bisaUlasan,
            'ulasanSaya' => $ulasanSaya ? ['rating' => $ulasanSaya->rating, 'komentar' => $ulasanSaya->komentar] : null,
        ]);
    }

    /**
     * Halaman full-screen terpisah untuk "Baca Online".
     */
    public function baca(Buku $buku)
    {
        $koleksi = KoleksiPribadi::where('user_id', Auth::id())->where('buku_id', $buku->id)->first();

        return Inertia::render('Katalog/Baca', [
            'buku' => $buku->only(['id', 'judul_buku', 'file_pdf_url']),
            'halamanTerakhir' => $koleksi->halaman_terakhir ?? 1,
            'catatanBacaan' => $koleksi->catatan_bacaan ?? '',
        ]);
    }

    public function updateBookmark(Request $request, Buku $buku)
    {
        $validated = $request->validate([
            'halaman_terakhir' => 'nullable|integer|min:0',
            'catatan_bacaan' => 'nullable|string|max:2000',
        ]);

        KoleksiPribadi::updateOrCreate(
            ['user_id' => Auth::id(), 'buku_id' => $buku->id],
            $validated,
        );

        return back();
    }
}
