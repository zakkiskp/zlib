<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Peminjaman - Z-Lib</title>
    <style>
        @page { margin: 24px 32px; }
        body { font-family: 'Helvetica', Arial, sans-serif; font-size: 11px; color: #18181b; }

        .kop { display: table; width: 100%; border-bottom: 3px solid #18181b; padding-bottom: 10px; margin-bottom: 16px; }
        .kop-logo { display: table-cell; width: 60px; vertical-align: middle; }
        .kop-logo div { width: 48px; height: 48px; background: #18181b; border-radius: 10px; color: #fff; text-align: center; line-height: 48px; font-weight: bold; font-size: 18px; }
        .kop-text { display: table-cell; vertical-align: middle; padding-left: 12px; }
        .kop-text h1 { margin: 0; font-size: 18px; letter-spacing: -0.3px; }
        .kop-text p { margin: 2px 0 0; font-size: 10px; color: #52525b; }

        h2.title { text-align: center; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; margin: 12px 0 2px; }
        p.period { text-align: center; font-size: 10px; color: #52525b; margin: 0 0 16px; }

        table.data { width: 100%; border-collapse: collapse; margin-top: 8px; }
        table.data th { background: #18181b; color: #fff; padding: 6px 8px; text-align: left; font-size: 10px; }
        table.data td { padding: 6px 8px; border-bottom: 1px solid #e4e4e7; font-size: 10px; }
        table.data tr:nth-child(even) { background: #fafafa; }

        .badge { padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: bold; }
        .badge-dipinjam { background: #fef3c7; color: #92400e; }
        .badge-kembali { background: #dcfce7; color: #166534; }
        .badge-terlambat { background: #fee2e2; color: #991b1b; }

        .summary { margin-top: 14px; font-size: 10px; }
        .summary strong { color: #18181b; }

        .signature { margin-top: 48px; display: table; width: 100%; }
        .signature-box { display: table-cell; width: 50%; text-align: center; font-size: 10px; }
        .signature-box .line { margin-top: 56px; border-top: 1px solid #18181b; width: 70%; margin-left: auto; margin-right: auto; padding-top: 4px; }

        .footer-note { margin-top: 24px; font-size: 8px; color: #a1a1aa; text-align: center; }
    </style>
</head>
<body>
    <div class="kop">
        <div class="kop-logo"><div>ZL</div></div>
        <div class="kop-text">
            <h1>Z-Lib &mdash; Zaki Digital Library ERP System</h1>
            <p>Sistem Manajemen Perpustakaan Digital &bull; Dokumen dicetak otomatis oleh sistem</p>
        </div>
    </div>

    <h2 class="title">Laporan Sirkulasi Peminjaman</h2>
    <p class="period">Periode {{ $from->translatedFormat('d F Y') }} &ndash; {{ $to->translatedFormat('d F Y') }}</p>

    <table class="data">
        <thead>
            <tr>
                <th>No</th>
                <th>Anggota</th>
                <th>Judul Buku</th>
                <th>Tgl Pinjam</th>
                <th>Jatuh Tempo</th>
                <th>Tgl Kembali</th>
                <th>Status</th>
                <th>Denda</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($transactions as $i => $trx)
                <tr>
                    <td>{{ $i + 1 }}</td>
                    <td>{{ $trx->user->name ?? '-' }}</td>
                    <td>{{ $trx->buku->judul_buku ?? '-' }}</td>
                    <td>{{ optional($trx->tanggal_pinjam)->format('d/m/Y') }}</td>
                    <td>{{ optional($trx->tanggal_jatuh_tempo)->format('d/m/Y') }}</td>
                    <td>{{ $trx->tanggal_kembali ? $trx->tanggal_kembali->format('d/m/Y') : '-' }}</td>
                    <td>
                        <span class="badge badge-{{ $trx->status === 'dikembalikan' ? 'kembali' : ($trx->status === 'terlambat' ? 'terlambat' : 'dipinjam') }}">
                            {{ ucfirst($trx->status) }}
                        </span>
                    </td>
                    <td>Rp {{ number_format($trx->denda ?? 0, 0, ',', '.') }}</td>
                </tr>
            @empty
                <tr><td colspan="8" style="text-align:center; padding: 16px;">Tidak ada data transaksi pada periode ini.</td></tr>
            @endforelse
        </tbody>
    </table>

    <p class="summary">
        Total transaksi: <strong>{{ $transactions->count() }}</strong> &nbsp;|&nbsp;
        Total denda periode ini: <strong>Rp {{ number_format($transactions->sum('denda'), 0, ',', '.') }}</strong>
    </p>

    <div class="signature">
        <div class="signature-box">
            <div>Mengetahui,</div>
            <div class="line">Kepala Perpustakaan</div>
        </div>
        <div class="signature-box">
            <div>{{ $generatedAt->translatedFormat('d F Y') }}</div>
            <div class="line">Admin Sistem Z-Lib</div>
        </div>
    </div>

    <p class="footer-note">Dokumen ini dibuat otomatis oleh sistem Z-Lib pada {{ $generatedAt->format('d/m/Y H:i') }} WIB dan sah tanpa tanda tangan basah.</p>
</body>
</html>
