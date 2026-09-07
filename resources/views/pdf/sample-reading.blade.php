<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $buku->judul_buku }} — Z-Lib {{ $labels['docTitleSuffix'] }}</title>
    <style>
        {{--
            CATATAN HAK CIPTA (baca ini kalau mau ubah template):
            Halaman "Bab" di bawah diisi tulisan ORIGINAL milik sendiri,
            dikelompokkan per kategori buku (lihat SampleReadingContent.php).
            BUKAN Lorem Ipsum, dan BUKAN kutipan dari buku asli manapun.
            Jangan ganti isinya dengan teks hasil scraping/copy-paste dari
            buku berhak cipta. Kalau mau memakai teks asli, pastikan buku
            tersebut memang berstatus domain publik atau Anda punya
            lisensi sah untuk itu.
        --}}
        @page { margin: 46pt 42pt; }

        body { font-family: 'Helvetica', Arial, sans-serif; color: #18181b; font-size: 10.5pt; line-height: 1.6; }

        .page { page-break-after: always; }
        .page:last-child { page-break-after: auto; }

        /* ===== Cover ===== */
        .cover { display: table; width: 100%; height: 492pt; background: #18181b; color: #fafafa; border-radius: 4pt; }
        .cover-inner { display: table-cell; vertical-align: middle; text-align: center; padding: 20pt 34pt; }
        .cover-brand-logo { width: 28pt; height: 28pt; border-radius: 7pt; margin: 0 auto 8pt; display: block; }
        .cover-brand { font-size: 8.5pt; letter-spacing: 1.5pt; text-transform: uppercase; color: #a1a1aa; margin-bottom: 10pt; }
        .cover-art { width: 140pt; height: 175pt; margin: 0 auto 14pt; border-radius: 6pt; }
        .cover-art img { width: 140pt; height: 175pt; object-fit: cover; border-radius: 6pt; box-shadow: 0 8pt 24pt rgba(0,0,0,0.5); }
        .cover-art-placeholder { width: 140pt; height: 175pt; margin: 0 auto 14pt; border-radius: 6pt; background: #27272a; border: 1pt solid #3f3f46; display: table; }
        .cover-art-placeholder-inner { display: table-cell; vertical-align: middle; text-align: center; font-size: 38pt; font-weight: bold; color: #52525b; }
        .cover-title { font-size: 16pt; font-weight: bold; line-height: 1.28; margin: 0 0 6pt; }
        .cover-author { font-size: 10.5pt; color: #d4d4d8; margin: 0 0 12pt; }
        .cover-meta { font-size: 8.5pt; color: #a1a1aa; margin-bottom: 4pt; }
        .cover-isbn { font-size: 8pt; color: #71717a; }
        .cover-ribbon { display: inline-block; margin-top: 12pt; padding: 5pt 14pt; border: 1pt solid #52525b; border-radius: 100pt; font-size: 8pt; letter-spacing: 0.8pt; text-transform: uppercase; color: #e4e4e7; }

        /* ===== Konten umum ===== */
        .running-header { font-size: 8pt; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.6pt; border-bottom: 0.75pt solid #e4e4e7; padding-bottom: 8pt; margin-bottom: 22pt; }
        h1.section-title { font-size: 16pt; margin: 0 0 16pt; color: #18181b; }
        p { margin: 0 0 11pt; text-align: justify; }

        .info-box { display: table; width: 100%; margin-top: 22pt; border: 0.75pt solid #e4e4e7; border-radius: 4pt; }
        .info-row { display: table-row; }
        .info-cell { display: table-cell; padding: 7pt 10pt; font-size: 9pt; border-bottom: 0.75pt solid #f4f4f5; }
        .info-cell.label { color: #71717a; width: 38%; }
        .info-cell.value { color: #18181b; font-weight: bold; }

        .chapter-num { display: inline-block; font-size: 8pt; letter-spacing: 1pt; text-transform: uppercase; color: #fff; background: #18181b; padding: 4pt 10pt; border-radius: 100pt; margin-bottom: 10pt; }
        .chapter-intro { font-size: 9pt; font-style: italic; color: #71717a; border-left: 2pt solid #e4e4e7; padding-left: 10pt; margin-bottom: 16pt; }
        .dropcap { float: left; font-size: 30pt; font-weight: bold; line-height: 1; padding: 2pt 6pt 0 0; }

        .page-footer { position: fixed; bottom: -34pt; left: 0; right: 0; font-size: 7.5pt; color: #a1a1aa; text-align: center; border-top: 0.75pt solid #f4f4f5; padding-top: 6pt; }

        .closing { text-align: center; padding-top: 120pt; }
        .closing-mark { font-size: 9pt; letter-spacing: 2pt; text-transform: uppercase; color: #a1a1aa; margin-bottom: 18pt; }
        .closing-text { font-size: 11.5pt; color: #18181b; max-width: 340pt; margin: 0 auto 8pt; }
        .closing-cta { font-size: 9.5pt; color: #52525b; max-width: 320pt; margin: 18pt auto 0; }
        .closing-footer { margin-top: 60pt; font-size: 7.5pt; color: #a1a1aa; }
    </style>
</head>
<body>

    {{-- ===================== HALAMAN 1: COVER ===================== --}}
    <div class="page">
        <div class="cover">
            <div class="cover-inner">
                {{-- FIX BUG (logo cover PDF beda dari favicon tab browser):
                     $logoDataUri adalah favicon ASLI aplikasi (dibaca dari
                     public/icon-192.png), bukan digambar ulang — dijamin
                     identik dengan ikon "Z" di tab browser. --}}
                @if ($logoDataUri)
                    <img src="{{ $logoDataUri }}" alt="Z-Lib" class="cover-brand-logo">
                @endif
                <div class="cover-brand">Z-Lib &bull; Digital Library ERP System</div>

                {{-- FIX BUG (cover PDF pakai gambar buku asli): sebelumnya
                     di sini cuma badge "ZL" generik yang sama untuk semua
                     buku. $coverDataUri sudah diunduh & diverifikasi valid
                     di SampleBookPdfGenerator (base64 data URI, aman dari
                     enable_remote=false dompdf). Kalau gagal diunduh
                     (offline, DNS error, dsb), coverDataUri null dan kita
                     fallback ke kotak inisial huruf pertama judul —
                     tetap terasa spesifik per buku, bukan placeholder polos. --}}
                @if ($coverDataUri)
                    <div class="cover-art">
                        <img src="{{ $coverDataUri }}" alt="{{ $buku->judul_buku }}">
                    </div>
                @else
                    <div class="cover-art-placeholder">
                        <div class="cover-art-placeholder-inner">{{ mb_strtoupper(mb_substr($buku->judul_buku, 0, 1)) }}</div>
                    </div>
                @endif

                <div class="cover-title">{{ $buku->judul_buku }}</div>
                <div class="cover-author">{{ $labels['by'] }} {{ $buku->penulis }}</div>
                <div class="cover-meta">{{ $buku->penerbit }} &bull; {{ $buku->tahun_terbit }} &bull; {{ $kategoriNama }}</div>
                <div class="cover-isbn">{{ $labels['isbn'] }} {{ $buku->isbn }}</div>
                <div class="cover-ribbon">{{ $labels['brandRibbon'] }}</div>
            </div>
        </div>
    </div>

    {{-- ===================== HALAMAN 2: SINOPSIS ===================== --}}
    <div class="page">
        <div class="running-header">{{ $buku->judul_buku }}</div>
        <h1 class="section-title">{{ $labels['synopsis'] }}</h1>
        <p>{{ $buku->deskripsi }}</p>

        <div class="info-box">
            <div class="info-row">
                <div class="info-cell label">{{ $labels['author'] }}</div>
                <div class="info-cell value">{{ $buku->penulis }}</div>
            </div>
            <div class="info-row">
                <div class="info-cell label">{{ $labels['publisher'] }}</div>
                <div class="info-cell value">{{ $buku->penerbit }} ({{ $buku->tahun_terbit }})</div>
            </div>
            <div class="info-row">
                <div class="info-cell label">{{ $labels['category'] }}</div>
                <div class="info-cell value">{{ $kategoriNama }}</div>
            </div>
            <div class="info-row">
                <div class="info-cell label">{{ $labels['language'] }}</div>
                <div class="info-cell value">{{ $bahasaTampil }}</div>
            </div>
            <div class="info-row">
                <div class="info-cell label">{{ $labels['pageCount'] }}</div>
                <div class="info-cell value">{{ $buku->jumlah_halaman ?? '-' }}</div>
            </div>
            <div class="info-row">
                <div class="info-cell label">{{ $labels['isbn'] }}</div>
                <div class="info-cell value">{{ $buku->isbn }}</div>
            </div>
        </div>

        <div class="page-footer">{{ str_replace([':n', ':total'], [2, $totalHalamanSample], $labels['pageFooter']) }}</div>
    </div>

    {{-- ===================== HALAMAN BAB (PREVIEW) ===================== --}}
    @foreach ($chapters as $chapter)
        <div class="page">
            <div class="running-header">{{ $buku->judul_buku }} &bull; {{ $buku->penulis }}</div>
            <div class="chapter-num">{{ $labels['chapter'] }} {{ $chapter['nomor'] }}</div>
            <h1 class="section-title">{{ $chapter['judul'] }}</h1>

            @if (!empty($chapter['catatanPembuka']))
                <p class="chapter-intro">{{ $chapter['catatanPembuka'] }}</p>
            @endif

            @foreach ($chapter['paragraphs'] as $i => $paragraph)
                <p>@if ($i === 0)<span class="dropcap">{{ mb_substr($paragraph, 0, 1) }}</span>{{ mb_substr($paragraph, 1) }}@else{{ $paragraph }}@endif</p>
            @endforeach

            <div class="page-footer">{{ str_replace([':n', ':total'], [$chapter['nomor'] + 2, $totalHalamanSample], $labels['pageFooter']) }}</div>
        </div>
    @endforeach

    {{-- ===================== HALAMAN PENUTUP ===================== --}}
    <div class="page">
        <div class="closing">
            <div class="closing-mark">&mdash; {{ $labels['endOfPreview'] }} &mdash;</div>
            <p class="closing-text">{!! str_replace(':title', '<strong>' . e($buku->judul_buku) . '</strong>', e($labels['closingText'])) !!}</p>
            <p class="closing-cta">{{ $labels['closingCta'] }}</p>
            <div class="closing-footer">
                Z-Lib
            </div>
        </div>
    </div>

</body>
</html>
