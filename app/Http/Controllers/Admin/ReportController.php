<?php

namespace App\Http\Controllers\Admin;

use App\Exports\LoanReportExport;
use App\Http\Controllers\Controller;
use App\Models\Peminjaman;
use App\Services\AuditLogger;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        $from = $request->date('from') ?? now()->startOfMonth();
        $to = $request->date('to') ?? now()->endOfMonth();

        $transactions = $this->buildReportQuery($from, $to)->paginate(15)->withQueryString();

        return Inertia::render('Admin/Report/Index', [
            'transactions' => $transactions,
            'filters' => [
                'from' => $from->toDateString(),
                'to' => $to->toDateString(),
            ],
            'summary' => [
                'total_transaksi' => (clone $transactions)->total(),
                'total_denda' => (int) $this->buildReportQuery($from, $to)->sum('denda'),
                'belum_kembali' => (clone $this->buildReportQuery($from, $to))->whereNull('tanggal_kembali')->count(),
            ],
        ]);
    }

    public function exportPdf(Request $request)
    {
        $from = $request->date('from') ?? now()->startOfMonth();
        $to = $request->date('to') ?? now()->endOfMonth();

        $transactions = $this->buildReportQuery($from, $to)->get();

        $pdf = Pdf::loadView('reports.loan-report-pdf', [
            'transactions' => $transactions,
            'from' => $from,
            'to' => $to,
            'generatedAt' => now(),
        ])->setPaper('a4', 'landscape');

        AuditLogger::log(
            'export',
            'laporan',
            "Export laporan peminjaman PDF periode {$from->toDateString()} s/d {$to->toDateString()}."
        );

        return $pdf->download("laporan-peminjaman-{$from->toDateString()}-{$to->toDateString()}.pdf");
    }

    public function exportExcel(Request $request)
    {
        $from = $request->date('from') ?? now()->startOfMonth();
        $to = $request->date('to') ?? now()->endOfMonth();

        AuditLogger::log(
            'export',
            'laporan',
            "Export laporan peminjaman Excel periode {$from->toDateString()} s/d {$to->toDateString()}."
        );

        return Excel::download(
            new LoanReportExport($from, $to),
            "laporan-peminjaman-{$from->toDateString()}-{$to->toDateString()}.xlsx"
        );
    }

    private function buildReportQuery($from, $to)
    {
        // FIX: Mengubah relasi 'user' menjadi 'anggota' sesuai dengan model Peminjaman
        return Peminjaman::query()
            ->with(['anggota:id,name,email', 'buku:id,judul_buku,penulis'])
            ->whereBetween('tanggal_pinjam', [$from, $to])
            ->latest('tanggal_pinjam');
    }
}