<?php

namespace App\Http\Controllers;

use App\Models\Peminjaman;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LaporanSirkulasiController extends Controller
{
    public function index(Request $request)
    {
        $dari = $request->date('dari') ?? now()->subDays(29)->startOfDay();
        $sampai = $request->date('sampai') ?? now()->endOfDay();

        $totalPeminjaman = Peminjaman::whereBetween('tanggal_pinjam', [$dari, $sampai])->count();
        $totalPengembalian = Peminjaman::whereBetween('tanggal_kembali', [$dari, $sampai])->count();
        $totalTerlambat = Peminjaman::whereBetween('tanggal_kembali', [$dari, $sampai])->where('denda', '>', 0)->count();
        $totalDenda = (int) Peminjaman::whereBetween('tanggal_kembali', [$dari, $sampai])->sum('denda');

        $bukuTerpopuler = Peminjaman::whereBetween('tanggal_pinjam', [$dari, $sampai])
            ->join('buku', 'buku.id', '=', 'peminjaman.buku_id')
            ->selectRaw('buku.judul_buku, COUNT(*) as total')
            ->groupBy('buku.id', 'buku.judul_buku')
            ->orderByDesc('total')
            ->take(5)
            ->get();

        return Inertia::render('Petugas/LaporanSirkulasi', [
            'ringkasan' => [
                'total_peminjaman' => $totalPeminjaman,
                'total_pengembalian' => $totalPengembalian,
                'total_terlambat' => $totalTerlambat,
                'total_denda' => $totalDenda,
            ],
            'bukuTerpopuler' => $bukuTerpopuler,
            'filters' => [
                'dari' => $dari->toDateString(),
                'sampai' => $sampai->toDateString(),
            ],
        ]);
    }
}
