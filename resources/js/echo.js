import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

let echo = null;

try {
    echo = new Echo({
        broadcaster: 'reverb',
        key: import.meta.env.VITE_REVERB_APP_KEY,
        wsHost: import.meta.env.VITE_REVERB_HOST,
        wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
        wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
        forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
        enabledTransports: ['ws', 'wss'],
    });

    // Pengaman: kalau server Reverb mati/tidak terhubung, hentikan reconnect agar tidak spam error di console
    echo.connector.pusher.connection.bind('error', (err) => {
        console.warn('[Z-Lib] Reverb tidak terhubung, notifikasi real-time nonaktif sementara.', err?.error?.data?.message ?? '');
        echo.connector.pusher.connection.disconnect();
    });
} catch (err) {
    console.warn('[Z-Lib] Gagal inisialisasi Laravel Echo:', err);
    echo = null;
}

window.Echo = echo;