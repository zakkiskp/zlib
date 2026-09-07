<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title inertia>{{ config('app.name', 'Zlib') }}</title>

        {{-- FIX BUG (favicon tidak muncul di tab browser): sebelumnya
             public/favicon.ico ada tapi KOSONG (0 byte) dan tidak pernah
             direferensikan sama sekali di <head>, jadi browser fallback ke
             ikon default/kosong. Sekarang pakai set ikon Z-Lib asli (mark
             huruf "Z", selaras tema dark zinc aplikasi) dengan beberapa
             ukuran supaya tajam di berbagai browser & saat di-pin ke Home
             Screen (iOS/Android). --}}
        <link rel="icon" href="{{ asset('favicon.ico') }}" sizes="any">
        <link rel="icon" type="image/png" sizes="16x16" href="{{ asset('icon-16.png') }}">
        <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('icon-32.png') }}">
        <link rel="icon" type="image/png" sizes="192x192" href="{{ asset('icon-192.png') }}">
        <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('apple-touch-icon.png') }}">
        <meta name="theme-color" content="#18181b">

        {{-- Anti-flash: set class `dark` & data-accent SEBELUM CSS/React dimuat,
             supaya tidak ada kedipan tema salah warna sesaat halaman terbuka. --}}
        <script>
            (function () {
                var mode = localStorage.getItem('zlib-theme-mode') || 'dark';
                var accent = localStorage.getItem('zlib-theme-accent') || 'emerald';
                document.documentElement.classList.toggle('dark', mode === 'dark');
                document.documentElement.setAttribute('data-accent', accent);
            })();
        </script>

        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
