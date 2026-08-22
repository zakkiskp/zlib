<?php

namespace App\Http\Middleware;

use App\Models\Notifikasi;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * `notifikasi` & `notifikasiBelumDibaca` di-share ke SEMUA halaman
     * (bukan cuma satu controller) karena NotificationBell ada di Topbar,
     * yang muncul di setiap halaman ber-auth.
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'notifikasi' => fn () => $request->user()
                ? Notifikasi::where('user_id', $request->user()->id)
                    ->latest()
                    ->take(10)
                    ->get()
                    ->map(fn ($n) => [
                        'id' => $n->id,
                        'judul' => $n->judul,
                        'pesan' => $n->pesan,
                        'tipe' => $n->tipe,
                        'is_read' => $n->is_read,
                        'link' => $n->link,
                        'waktu' => $n->created_at->diffForHumans(),
                    ])
                : [],
            'notifikasiBelumDibaca' => fn () => $request->user()
                ? Notifikasi::where('user_id', $request->user()->id)->where('is_read', false)->count()
                : 0,
        ];
    }
}
