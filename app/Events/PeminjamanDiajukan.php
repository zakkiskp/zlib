<?php

namespace App\Events;

use App\Models\Peminjaman;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PeminjamanDiajukan implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Peminjaman $peminjaman)
    {
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('circulation-desk'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'peminjaman.diajukan';
    }

    public function broadcastWith(): array
    {
        $this->peminjaman->loadMissing(['anggota:id,name,avatar_url', 'buku:id,judul_buku,cover_url,stok_tersedia']);

        return [
            'id' => $this->peminjaman->id,
            'nama' => $this->peminjaman->anggota->name ?? '—',
            'avatar' => $this->peminjaman->anggota->avatar_url ?? null,
            'buku' => $this->peminjaman->buku->judul_buku ?? '—',
            'cover' => $this->peminjaman->buku->cover_url ?? null,
            'waktu' => 'Baru saja',
        ];
    }
}
