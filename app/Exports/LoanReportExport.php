<?php

namespace App\Exports;

use App\Models\Peminjaman;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class LoanReportExport implements FromQuery, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    private int $rowNumber = 0;

    public function __construct(
        protected $from,
        protected $to,
    ) {}

    public function query()
    {
        return Peminjaman::query()
            ->with(['user:id,name,email', 'buku:id,judul_buku,penulis'])
            ->whereBetween('tanggal_pinjam', [$this->from, $this->to])
            ->latest('tanggal_pinjam');
    }

    public function headings(): array
    {
        return [
            'No', 'Nama Anggota', 'Email', 'Judul Buku', 'Penulis',
            'Tgl Pinjam', 'Tgl Jatuh Tempo', 'Tgl Kembali', 'Status', 'Denda (Rp)',
        ];
    }

    public function map($row): array
    {
        $this->rowNumber++;

        return [
            $this->rowNumber,
            $row->user->name ?? '-',
            $row->user->email ?? '-',
            $row->buku->judul_buku ?? '-',
            $row->buku->penulis ?? '-',
            optional($row->tanggal_pinjam)->format('d/m/Y'),
            optional($row->tanggal_jatuh_tempo)->format('d/m/Y'),
            $row->tanggal_kembali ? $row->tanggal_kembali->format('d/m/Y') : 'Belum Kembali',
            ucfirst($row->status),
            number_format($row->denda ?? 0, 0, ',', '.'),
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
