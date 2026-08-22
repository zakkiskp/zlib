<?php

namespace App\Http\Controllers;

use App\Models\Notifikasi;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotifikasiController extends Controller
{
    public function index()
    {
        $notifikasi = Notifikasi::where('user_id', Auth::id())
            ->latest()
            ->paginate(15);

        return Inertia::render('Notifikasi/Index', [
            'notifikasi' => $notifikasi,
        ]);
    }

    public function markAllRead()
    {
        Notifikasi::where('user_id', Auth::id())->where('is_read', false)->update(['is_read' => true]);

        return back();
    }

    public function markAsRead(Notifikasi $notifikasi)
    {
        abort_unless($notifikasi->user_id === Auth::id(), 403);

        $notifikasi->update(['is_read' => true]);

        return back();
    }
}
