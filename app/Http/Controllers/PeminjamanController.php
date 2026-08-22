<?php

namespace App\Http\Controllers;

use App\Events\NotifikasiDibuat;
use App\Events\PeminjamanDiajukan;
use App\Models\Buku;
use App\Models\Notifikasi;
use App\Models\PengaturanSistem;
use App\Models\Peminjaman;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PeminjamanController extends Controller
{
    /**
     * Anggota mengajukan peminjaman buku dari modal Katalog.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'buku_id' => 'required|exists:buku,id',
        ]);

        $buku = Buku::findOrFail($validated['buku_id']);

        if ($buku->stok_tersedia < 1) {
            return back()->withErrors(['buku_id' => 'Stok buku ini sedang habis.']);
        }

        $sudahAda = Peminjaman::where('user_id', Auth::id())
            ->where('buku_id', $buku->id)
            ->whereIn('status', ['menunggu_persetujuan', 'disetujui', 'dipinjam'])
            ->exists();

        if ($sudahAda) {
            return back()->withErrors(['buku_id' => 'Kamu masih punya peminjaman aktif untuk buku ini.']);
        }

        $peminjaman = Peminjaman::create([
            'user_id' => Auth::id(),
            'buku_id' => $buku->id,
            'tanggal_pengajuan' => now(),
            'status' => 'menunggu_persetujuan',
        ]);

        // Live update: antrean Circulation Desk petugas langsung ke-update
        // tanpa mereka perlu refresh halaman.
        PeminjamanDiajukan::dispatch($peminjaman);

        return back()->with('success', 'Pengajuan peminjaman berhasil dikirim, menunggu persetujuan petugas.');
    }

    /**
     * Halaman "Peminjaman Saya" — anggota memantau pinjaman aktif & riwayat.
     */
    public function saya(Request $request)
    {
        $user = $request->user();

        $aktif = Peminjaman::with('buku:id,judul_buku,cover_url,penulis')
            ->where('user_id', $user->id)
            ->whereIn('status', ['menunggu_persetujuan', 'disetujui', 'dipinjam', 'terlambat'])
            ->latest('tanggal_pengajuan')
            ->get();

        $riwayat = Peminjaman::with('buku:id,judul_buku,cover_url,penulis')
            ->where('user_id', $user->id)
            ->whereIn('status', ['dikembalikan', 'ditolak'])
            ->latest('tanggal_pengajuan')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Peminjaman/Saya', [
            'aktif' => $aktif,
            'riwayat' => $riwayat,
            'pengaturan' => [
                'denda_per_hari' => (int) PengaturanSistem::get('denda_per_hari', 1000),
                'max_perpanjangan' => (int) PengaturanSistem::get('max_perpanjangan', 1),
            ],
        ]);
    }

    /**
     * Anggota mengajukan perpanjangan — masih perlu disetujui petugas.
     */
    public function perpanjang(Request $request, Peminjaman $peminjaman)
    {
        abort_unless($peminjaman->user_id === $request->user()->id, 403);

        if ($peminjaman->status !== 'dipinjam') {
            return back()->withErrors(['perpanjangan' => 'Hanya peminjaman berstatus dipinjam yang bisa diperpanjang.']);
        }

        if ($peminjaman->status_perpanjangan === 'menunggu') {
            return back()->withErrors(['perpanjangan' => 'Perpanjangan sebelumnya masih menunggu persetujuan.']);
        }

        $maxPerpanjangan = (int) PengaturanSistem::get('max_perpanjangan', 1);
        if ($peminjaman->jumlah_perpanjangan >= $maxPerpanjangan) {
            return back()->withErrors(['perpanjangan' => 'Batas maksimal perpanjangan sudah tercapai.']);
        }

        $peminjaman->update(['status_perpanjangan' => 'menunggu']);

        return back()->with('success', 'Pengajuan perpanjangan terkirim, menunggu persetujuan petugas.');
    }

    /**
     * Circulation Desk — petugas memproses approval, perpanjangan, & pengembalian.
     */
    public function circulationDesk()
    {
        $menunggu = Peminjaman::with(['anggota:id,name,avatar_url', 'buku:id,judul_buku,cover_url,stok_tersedia'])
            ->where('status', 'menunggu_persetujuan')
            ->latest('tanggal_pengajuan')
            ->get();

        $perpanjangan = Peminjaman::with(['anggota:id,name,avatar_url', 'buku:id,judul_buku,cover_url'])
            ->where('status_perpanjangan', 'menunggu')
            ->get();

        $sedangDipinjam = Peminjaman::with(['anggota:id,name,avatar_url', 'buku:id,judul_buku,cover_url'])
            ->whereIn('status', ['dipinjam', 'terlambat'])
            ->orderBy('tanggal_jatuh_tempo')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Petugas/CirculationDesk', [
            'menunggu' => $menunggu,
            'perpanjangan' => $perpanjangan,
            'sedangDipinjam' => $sedangDipinjam,
        ]);
    }

    public function approve(Request $request, Peminjaman $peminjaman)
    {
        abort_unless($peminjaman->status === 'menunggu_persetujuan', 422);

        $buku = $peminjaman->buku;
        if ($buku->stok_tersedia < 1) {
            return back()->withErrors(['approval' => 'Stok buku sudah habis, tidak bisa disetujui.']);
        }

        $durasi = (int) PengaturanSistem::get('durasi_pinjam_default', 7);
        $mulai = now();

        $peminjaman->update([
            'petugas_id' => $request->user()->id,
            'status' => 'dipinjam',
            'tanggal_pinjam' => $mulai,
            'tanggal_jatuh_tempo' => $mulai->copy()->addDays($durasi),
        ]);

        $buku->decrement('stok_tersedia');

        $notifikasi = Notifikasi::create([
            'user_id' => $peminjaman->user_id,
            'judul' => 'Peminjaman disetujui',
            'pesan' => "Pengajuan \"{$buku->judul_buku}\" telah disetujui. Batas kembali: " . $peminjaman->tanggal_jatuh_tempo->translatedFormat('d M Y') . '.',
            'tipe' => 'approval',
            'link' => '/peminjaman-saya',
        ]);
        NotifikasiDibuat::dispatch($notifikasi);

        return back()->with('success', 'Peminjaman disetujui.');
    }

    public function reject(Request $request, Peminjaman $peminjaman)
    {
        abort_unless($peminjaman->status === 'menunggu_persetujuan', 422);

        $peminjaman->update([
            'petugas_id' => $request->user()->id,
            'status' => 'ditolak',
        ]);

        $notifikasi = Notifikasi::create([
            'user_id' => $peminjaman->user_id,
            'judul' => 'Peminjaman ditolak',
            'pesan' => "Pengajuan \"{$peminjaman->buku->judul_buku}\" tidak dapat disetujui saat ini.",
            'tipe' => 'approval',
            'link' => '/peminjaman-saya',
        ]);
        NotifikasiDibuat::dispatch($notifikasi);

        return back()->with('success', 'Peminjaman ditolak.');
    }

    public function kembalikan(Request $request, Peminjaman $peminjaman)
    {
        abort_unless(in_array($peminjaman->status, ['dipinjam', 'terlambat']), 422);

        $sekarang = now();
        $dendaPerHari = (int) PengaturanSistem::get('denda_per_hari', 1000);
        $telat = $sekarang->gt($peminjaman->tanggal_jatuh_tempo)
            ? $peminjaman->tanggal_jatuh_tempo->diffInDays($sekarang)
            : 0;
        $jumlahDenda = $telat * $dendaPerHari;

        $peminjaman->update([
            'status' => 'dikembalikan',
            'tanggal_kembali' => $sekarang,
            'denda' => $jumlahDenda,
            'status_denda' => $telat > 0 ? 'belum_lunas' : 'lunas',
            'petugas_id' => $request->user()->id,
        ]);

        $peminjaman->buku()->increment('stok_tersedia');

        $pesan = 'Buku berhasil dikembalikan.';
        if ($telat > 0) {
            $pesan .= ' Denda: Rp' . number_format($jumlahDenda, 0, ',', '.');

            $notifikasi = Notifikasi::create([
                'user_id' => $peminjaman->user_id,
                'judul' => 'Denda tercatat',
                'pesan' => "Denda Rp" . number_format($jumlahDenda, 0, ',', '.') . " untuk keterlambatan \"{$peminjaman->buku->judul_buku}\".",
                'tipe' => 'denda',
                'link' => '/peminjaman-saya',
            ]);
            NotifikasiDibuat::dispatch($notifikasi);
        }

        return back()->with('success', $pesan);
    }

    public function approvePerpanjangan(Peminjaman $peminjaman)
    {
        abort_unless($peminjaman->status_perpanjangan === 'menunggu', 422);

        $durasi = (int) PengaturanSistem::get('durasi_pinjam_default', 7);

        $peminjaman->update([
            'status_perpanjangan' => 'disetujui',
            'jumlah_perpanjangan' => $peminjaman->jumlah_perpanjangan + 1,
            'tanggal_jatuh_tempo' => $peminjaman->tanggal_jatuh_tempo->copy()->addDays($durasi),
        ]);

        $notifikasi = Notifikasi::create([
            'user_id' => $peminjaman->user_id,
            'judul' => 'Perpanjangan disetujui',
            'pesan' => "Perpanjangan \"{$peminjaman->buku->judul_buku}\" disetujui. Batas baru: " . $peminjaman->tanggal_jatuh_tempo->translatedFormat('d M Y') . '.',
            'tipe' => 'jatuh_tempo',
            'link' => '/peminjaman-saya',
        ]);
        NotifikasiDibuat::dispatch($notifikasi);

        return back()->with('success', 'Perpanjangan disetujui.');
    }

    public function rejectPerpanjangan(Peminjaman $peminjaman)
    {
        abort_unless($peminjaman->status_perpanjangan === 'menunggu', 422);

        $peminjaman->update(['status_perpanjangan' => 'ditolak']);

        $notifikasi = Notifikasi::create([
            'user_id' => $peminjaman->user_id,
            'judul' => 'Perpanjangan ditolak',
            'pesan' => "Pengajuan perpanjangan \"{$peminjaman->buku->judul_buku}\" ditolak.",
            'tipe' => 'jatuh_tempo',
            'link' => '/peminjaman-saya',
        ]);
        NotifikasiDibuat::dispatch($notifikasi);

        return back()->with('success', 'Perpanjangan ditolak.');
    }
}
