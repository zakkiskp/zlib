<?php

namespace App\Http\Controllers;

use App\Models\Buku;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * ⚠️ CATATAN PENTING — SESUAIKAN FORMAT PAYLOAD QR:
 * Saya tidak punya visibilitas ke generator QR Code E-KTA Anda dari
 * Langkah 6B, jadi controller ini mengasumsikan payload QR memakai salah
 * satu format berikut:
 *   - E-KTA Anggota : "ZLIB-MEMBER:{id_user}"
 *   - Buku           : "ZLIB-BOOK:{isbn}"   atau ISBN mentah tanpa prefix
 * Kalau generator QR E-KTA Anda menghasilkan format lain (mis. UUID murni
 * atau JSON), sesuaikan method resolveCode() di bawah agar cocok.
 * Kolom `member_code` di resolveMember() juga asumsi — ganti dengan nama
 * kolom identifier E-KTA asli Anda kalau berbeda dari `id`.
 */
class PetugasQrScannerController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Petugas/QrScanner/Index');
    }

    public function process(Request $request): JsonResponse
    {
        $request->validate([
            'code' => ['required', 'string', 'max:255'],
        ]);

        $result = $this->resolveCode(trim($request->input('code')));

        if (! $result) {
            return response()->json([
                'found' => false,
                'message' => 'Kode tidak dikenali. Pastikan format QR sesuai (E-KTA anggota atau ISBN buku).',
            ], 404);
        }

        return response()->json($result);
    }

    private function resolveCode(string $code): ?array
    {
        if (str_starts_with($code, 'ZLIB-MEMBER:')) {
            return $this->resolveMember(substr($code, strlen('ZLIB-MEMBER:')));
        }

        if (str_starts_with($code, 'ZLIB-BOOK:')) {
            return $this->resolveBook(substr($code, strlen('ZLIB-BOOK:')));
        }

        // Fallback: coba cocokkan sebagai ISBN buku dulu, baru sebagai anggota.
        return $this->resolveBook($code) ?? $this->resolveMember($code);
    }

    private function resolveMember(string $identifier): ?array
    {
        $user = User::where('id', $identifier)
            ->orWhere('member_code', $identifier) // GANTI kalau kolom E-KTA Anda beda nama
            ->first();

        if (! $user) {
            return null;
        }

        return [
            'found' => true,
            'type' => 'member',
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'avatar_url' => $user->avatar_url,
            ],
        ];
    }

    private function resolveBook(string $identifier): ?array
    {
        $buku = Buku::where('isbn', $identifier)->orWhere('id', $identifier)->first();

        if (! $buku) {
            return null;
        }

        return [
            'found' => true,
            'type' => 'book',
            'data' => [
                'id' => $buku->id,
                'judul_buku' => $buku->judul_buku,
                'penulis' => $buku->penulis,
                'cover_url' => $buku->cover_url,
                'stok_tersedia' => $buku->stok_tersedia,
                'total_stok' => $buku->total_stok,
            ],
        ];
    }
}
