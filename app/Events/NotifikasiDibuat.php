<?php

namespace App\Events;

use App\Models\Notifikasi;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Pakai ShouldBroadcastNow (bukan ShouldBroadcast) supaya broadcast terjadi
 * LANGSUNG di request yang sama — tidak butuh queue worker terpisah jalan
 * di background, cukup Reverb server saja yang perlu aktif.
 */
class NotifikasiDibuat implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Notifikasi $notifikasi)
    {
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('notifikasi.' . $this->notifikasi->user_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'notifikasi.baru';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->notifikasi->id,
            'judul' => $this->notifikasi->judul,
            'pesan' => $this->notifikasi->pesan,
            'tipe' => $this->notifikasi->tipe,
            'is_read' => false,
            'link' => $this->notifikasi->link,
            'waktu' => 'Baru saja',
        ];
    }
}
