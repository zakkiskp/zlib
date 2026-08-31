<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\Buku;
use App\Models\KategoriBuku;
use App\Models\Peminjaman;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        return match ($user->role) {
            'admin' => Inertia::render('Dashboard', [
                'role' => 'admin',
                'data' => $this->dataAdmin(),
            ]),
            'petugas' => Inertia::render('Dashboard', [
                'role' => 'petugas',
                'data' => $this->dataPetugas(),
            ]),
            default => Inertia::render('Dashboard', [
                'role' => 'anggota',
                'data' => $this->dataAnggota($user),
            ]),
        };
    }

    private function dataAdmin(): array
    {
        $bulanIni = now()->startOfMonth();
        $bulanLalu = now()->subMonth()->startOfMonth();

        $totalBuku = Buku::count();
        $totalAnggota = User::where('role', 'anggota')->count();
        $peminjamanAktif = Peminjaman::whereIn('status', ['dipinjam', 'terlambat'])->count();
        $dendaBelumLunas = (int) Peminjaman::where('status_denda', 'belum_lunas')->sum('denda');

        $bukuBulanIni = Buku::where('created_at', '>=', $bulanIni)->count();
        $bukuBulanLalu = Buku::whereBetween('created_at', [$bulanLalu, $bulanIni])->count();
        $anggotaBulanIni = User::where('role', 'anggota')->where('created_at', '>=', $bulanIni)->count();
        $anggotaBulanLalu = User::where('role', 'anggota')->whereBetween('created_at', [$bulanLalu, $bulanIni])->count();

        $stats = [
            ['label' => 'dashboard.admin.stat.totalBooks', 'value' => $totalBuku, 'delta' => $this->hitungDelta($bukuBulanLalu, $bukuBulanIni), 'icon' => 'BookMarked'],
            ['label' => 'dashboard.admin.stat.totalMembers', 'value' => $totalAnggota, 'delta' => $this->hitungDelta($anggotaBulanLalu, $anggotaBulanIni), 'icon' => 'Users'],
            ['label' => 'dashboard.admin.stat.activeLoans', 'value' => $peminjamanAktif, 'delta' => null, 'icon' => 'Clock'],
            ['label' => 'dashboard.admin.stat.unpaidFines', 'value' => $dendaBelumLunas, 'format' => 'rupiah', 'delta' => null, 'icon' => 'Banknote'],
        ];

        // Tren peminjaman 6 bulan terakhir — untuk Gradient Area Line Chart
        $trend = [];
        for ($i = 5; $i >= 0; $i--) {
            $bulan = now()->subMonths($i);
            $trend[] = [
                'bulan' => $bulan->translatedFormat('M'),
                'total' => Peminjaman::whereNotNull('tanggal_pinjam')
                    ->whereYear('tanggal_pinjam', $bulan->year)
                    ->whereMonth('tanggal_pinjam', $bulan->month)
                    ->count(),
            ];
        }

        // Kategori populer berdasarkan JUMLAH PEMINJAMAN (bukan sekadar jumlah koleksi)
        $kategoriPopuler = KategoriBuku::query()
            ->select('kategori_buku.nama_kategori as nama')
            ->selectRaw('COUNT(peminjaman.id) as total')
            ->join('kategori_buku_relasi', 'kategori_buku_relasi.kategori_buku_id', '=', 'kategori_buku.id')
            ->join('peminjaman', 'peminjaman.buku_id', '=', 'kategori_buku_relasi.buku_id')
            ->groupBy('kategori_buku.id', 'kategori_buku.nama_kategori')
            ->orderByDesc('total')
            ->take(5)
            ->get();

        // Aktivitas terbaru — Real-time Global Activity Feed
        $aktivitas = Peminjaman::with(['anggota:id,name,avatar_url', 'buku:id,judul_buku'])
            ->latest('updated_at')
            ->take(8)
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'nama' => $p->anggota->name ?? '—',
                'avatar' => $p->anggota->avatar_url ?? null,
                'buku' => $p->buku->judul_buku ?? '—',
                'status' => $p->status,
                'waktu' => $p->updated_at->diffForHumans(),
            ]);

        return compact('stats', 'trend', 'kategoriPopuler', 'aktivitas');
    }

    private function dataPetugas(): array
    {
        $hariIni = today();

        $transaksiHariIni = Peminjaman::whereDate('tanggal_pinjam', $hariIni)
            ->orWhereDate('tanggal_kembali', $hariIni)
            ->count();

        $stats = [
            ['label' => 'dashboard.petugas.stat.todayTransactions', 'value' => $transaksiHariIni, 'icon' => 'Activity'],
            ['label' => 'dashboard.petugas.stat.pendingApproval', 'value' => Peminjaman::where('status', 'menunggu_persetujuan')->count(), 'icon' => 'ClipboardCheck'],
            ['label' => 'dashboard.petugas.stat.overdueBooks', 'value' => Peminjaman::where('status', 'terlambat')->count(), 'icon' => 'AlertTriangle'],
        ];

        $antrean = Peminjaman::with(['anggota:id,name,avatar_url', 'buku:id,judul_buku,cover_url'])
            ->where('status', 'menunggu_persetujuan')
            ->latest('tanggal_pengajuan')
            ->take(6)
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'nama' => $p->anggota->name ?? '—',
                'avatar' => $p->anggota->avatar_url ?? null,
                'buku' => $p->buku->judul_buku ?? '—',
                'cover' => $p->buku->cover_url ?? null,
                'waktu' => $p->tanggal_pengajuan?->diffForHumans(),
            ]);

        $sirkulasiHarian = [];
        for ($i = 6; $i >= 0; $i--) {
            $tanggal = today()->subDays($i);
            $sirkulasiHarian[] = [
                'hari' => $tanggal->translatedFormat('D'),
                'pinjam' => Peminjaman::whereDate('tanggal_pinjam', $tanggal)->count(),
                'kembali' => Peminjaman::whereDate('tanggal_kembali', $tanggal)->count(),
            ];
        }

        return compact('stats', 'antrean', 'sirkulasiHarian');
    }

    private function dataAnggota(User $user): array
    {
        /**
         * FIX BUG KRITIS: sebelumnya query ke model `Pengumuman` (tabel
         * `pengumuman`, sisa skema Langkah 1) — sedangkan Admin membuat
         * pengumuman lewat `Announcement` (tabel `announcements`, dibuat
         * di Tahap 1 bersama fitur Announcement Manager). Dua tabel yang
         * TIDAK PERNAH nyambung, makanya pengumuman Admin tidak pernah
         * tampil di sini walau sudah dibuat & aktif. `Announcement::active()`
         * di bawah adalah scope yang sudah ada di app/Models/Announcement.php
         * (filter is_active + rentang tanggal tayang).
         *
         * Field di-mapping ke nama lama (judul/konten/gambar) supaya
         * AnnouncementBanner.jsx TIDAK PERLU diubah sama sekali.
         */
        $pengumuman = Announcement::active()->latest('created_at')->first();

        $stats = [
            [
                'label' => 'dashboard.anggota.stat.activeLoans',
                'value' => Peminjaman::where('user_id', $user->id)->whereIn('status', ['dipinjam', 'terlambat'])->count(),
                'icon' => 'Clock',
            ],
            [
                'label' => 'dashboard.anggota.stat.unpaidFines',
                'value' => (int) Peminjaman::where('user_id', $user->id)->where('status_denda', 'belum_lunas')->sum('denda'),
                'format' => 'rupiah',
                'icon' => 'Wallet',
            ],
        ];

        $rekomendasi = Buku::orderByDesc('rating_rata_rata')
            ->orderByDesc('jumlah_ulasan')
            ->take(8)
            ->get(['id', 'judul_buku', 'penulis', 'cover_url', 'rating_rata_rata', 'stok_tersedia']);

        $kategori = KategoriBuku::orderBy('nama_kategori')->get(['id', 'nama_kategori', 'icon']);

        return [
            'pengumuman' => $pengumuman ? [
                'id' => $pengumuman->id,
                'judul' => $pengumuman->title,
                'konten' => $pengumuman->content,
                'gambar' => $pengumuman->banner_image,
                'tipe' => $pengumuman->type,
            ] : null,
            'stats' => $stats,
            'rekomendasi' => $rekomendasi,
            'kategori' => $kategori,
        ];
    }

    private function hitungDelta(int $lama, int $baru): ?float
    {
        if ($lama === 0) {
            return $baru > 0 ? 100.0 : null;
        }

        return round((($baru - $lama) / $lama) * 100, 1);
    }
}
