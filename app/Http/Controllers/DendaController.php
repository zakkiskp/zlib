<?php

namespace App\Http\Controllers;

use App\Models\Peminjaman;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DendaController extends Controller
{
    public function index(Request $request)
    {
        $query = Peminjaman::with(['anggota:id,name,avatar_url', 'buku:id,judul_buku,cover_url'])
            ->where('denda', '>', 0);

        if ($status = $request->string('status')->toString()) {
            $query->where('status_denda', $status);
        }

        $denda = $query->latest('tanggal_kembali')->paginate(15)->withQueryString();

        return Inertia::render('Petugas/PengelolaanDenda', [
            'denda' => $denda,
            'filters' => $request->only(['status']),
            'ringkasan' => [
                'total_belum_lunas' => (int) Peminjaman::where('status_denda', 'belum_lunas')->sum('denda'),
                'jumlah_belum_lunas' => Peminjaman::where('status_denda', 'belum_lunas')->count(),
            ],
        ]);
    }

    public function markLunas(Peminjaman $peminjaman)
    {
        $peminjaman->update(['status_denda' => 'lunas']);

        return back()->with('success', 'Denda ditandai lunas.');
    }
}
