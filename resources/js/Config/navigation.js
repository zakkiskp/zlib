import {
  LayoutDashboard, BookOpen, Clock, Wallet, Heart, Star, IdCard, Users, ScanLine, RotateCcw, Library, Tags, Wrench, FileBarChart, CalendarClock, ShieldCheck, SlidersHorizontal, Megaphone, FileSpreadsheet, DatabaseBackup, Settings, ClipboardCheck,
} from 'lucide-react';

/**
 * FITUR i18n LABEL MENU:
 * Setiap item & section sekarang punya `labelKey`/`sectionKey` di samping
 * `label`/`section` aslinya (yang DIPERTAHANKAN sebagai fallback kalau
 * suatu saat useLanguage() dipanggil di luar <LanguageProvider>, atau kalau
 * ada bagian kode lain yang masih baca `.label`/`.section` langsung).
 *
 * Sidebar.jsx & BottomNav.jsx sekarang render lewat:
 *   t(item.labelKey)       bukan lagi item.label langsung
 *   t(section.sectionKey)  bukan lagi section.section langsung
 *
 * Untuk menambah menu baru: tambahkan labelKey baru di sini, LALU tambahkan
 * pasangan terjemahan id/en dengan key yang sama di LanguageContext.jsx.
 */

export const navigationByRole = {
  admin: [
      {
          section: 'Utama',
          sectionKey: 'nav.section.utama',
          items: [
              { label: 'Dashboard', labelKey: 'nav.menu.dashboard', href: '/dashboard', icon: LayoutDashboard },
          ]
      },
      {
          section: 'Master Data',
          sectionKey: 'nav.section.masterdata',
          items: [
              { label: 'Master Data Buku', labelKey: 'nav.menu.masterbuku', href: '/admin/buku', icon: Library },
              { label: 'Kategori & Taxonomi', labelKey: 'nav.menu.kategoritaxonomi', href: '/admin/kategori', icon: Tags },
              { label: 'User & Role', labelKey: 'nav.menu.userrole', href: '/admin/user', icon: Users },
          ]
      },
      {
          section: 'Manajemen & Laporan',
          sectionKey: 'nav.section.manajemenlaporan',
          items: [
              { label: 'Pengaturan Denda', labelKey: 'nav.menu.pengaturandenda', href: '/admin/profil', icon: SlidersHorizontal },
              { label: 'Laporan & BI', labelKey: 'nav.menu.laporanbi', href: '/admin/laporan', icon: FileSpreadsheet },
              { label: 'Audit Log', labelKey: 'nav.menu.auditlog', href: '/admin/audit-log', icon: ShieldCheck },
              { label: 'Pengumuman', labelKey: 'nav.menu.pengumuman', href: '/admin/pengumuman', icon: Megaphone },
          ]
      },
      {
          section: 'Akun',
          sectionKey: 'nav.section.akun',
          items: [
              { label: 'Profil & Sistem', labelKey: 'nav.menu.profilsistem', href: '/admin/profil', icon: Settings },
          ]
      }
  ],
  petugas: [
      {
          section: 'Utama',
          sectionKey: 'nav.section.utama',
          items: [
              { label: 'Dashboard', labelKey: 'nav.menu.dashboard', href: '/dashboard', icon: LayoutDashboard },
              { label: 'QR Scanner', labelKey: 'nav.menu.qrscanner', href: '/petugas/qr-scanner', icon: ScanLine },
          ]
      },
      {
          section: 'Sirkulasi',
          sectionKey: 'nav.section.sirkulasi',
          items: [
              { label: 'Circulation Desk', labelKey: 'nav.menu.circulationdesk', href: '/circulation-desk', icon: ClipboardCheck },
              { label: 'Denda & Pembayaran', labelKey: 'nav.menu.dendapembayaran', href: '/pengelolaan-denda', icon: Wallet },
          ]
      },
      {
          section: 'Katalog',
          sectionKey: 'nav.section.katalog',
          items: [
              { label: 'Data Buku', labelKey: 'nav.menu.databuku', href: '/data-buku', icon: Library },
              { label: 'Kategori & Rak', labelKey: 'nav.menu.kategorirak', href: '/kategori-rak', icon: Tags },
              { label: 'Preservasi Buku', labelKey: 'nav.menu.preservasibuku', href: '/preservasi-buku', icon: Wrench },
          ]
      },
      {
          section: 'Akun',
          sectionKey: 'nav.section.akun',
          items: [
              { label: 'Laporan Sirkulasi', labelKey: 'nav.menu.laporansirkulasi', href: '/laporan-sirkulasi', icon: FileBarChart },
              { label: 'Profil & Shift', labelKey: 'nav.menu.profilshift', href: '/profil', icon: CalendarClock },
          ]
      }
  ],
  anggota: [
      {
          section: 'Utama',
          sectionKey: 'nav.section.utama',
          items: [
              { label: 'Dashboard', labelKey: 'nav.menu.dashboard', href: '/dashboard', icon: LayoutDashboard },
              { label: 'Katalog Buku', labelKey: 'nav.menu.katalogbuku', href: '/katalog', icon: BookOpen },
          ]
      },
      {
          section: 'Peminjaman',
          sectionKey: 'nav.section.peminjaman',
          items: [
              { label: 'Peminjaman Saya', labelKey: 'nav.menu.peminjamansaya', href: '/peminjaman-saya', icon: Clock },
              { label: 'Koleksi Pribadi', labelKey: 'nav.menu.koleksipribadi', href: '/koleksi-pribadi', icon: Heart },
              { label: 'Ulasan Saya', labelKey: 'nav.menu.ulasansaya', href: '/ulasan-saya', icon: Star },
          ]
      },
      {
          section: 'Akun',
          sectionKey: 'nav.section.akun',
          items: [
              { label: 'Profil & E-KTA', labelKey: 'nav.menu.profilekta', href: '/profil', icon: IdCard },
          ]
      }
  ]
};

export const bottomNavByRole = {
    admin: [
        { label: 'Dashboard', labelKey: 'nav.bottom.dashboard', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Data Buku', labelKey: 'nav.bottom.databuku', href: '/admin/buku', icon: Library },
        { label: 'Audit Log', labelKey: 'nav.bottom.auditlog', href: '/admin/audit-log', icon: ShieldCheck },
        { label: 'Profil', labelKey: 'nav.bottom.profil', href: '/admin/profil', icon: Settings },
    ],
    petugas: [
        { label: 'Dashboard', labelKey: 'nav.bottom.dashboard', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Scanner', labelKey: 'nav.bottom.scanner', href: '/petugas/qr-scanner', icon: ScanLine },
        { label: 'Sirkulasi', labelKey: 'nav.bottom.sirkulasi', href: '/circulation-desk', icon: ClipboardCheck },
        { label: 'Profil', labelKey: 'nav.bottom.profil', href: '/profil', icon: CalendarClock },
    ],
    anggota: [
        { label: 'Beranda', labelKey: 'nav.bottom.beranda', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Katalog', labelKey: 'nav.bottom.katalog', href: '/katalog', icon: BookOpen },
        { label: 'Pinjaman', labelKey: 'nav.bottom.pinjaman', href: '/peminjaman-saya', icon: Clock },
        { label: 'Profil', labelKey: 'nav.bottom.profil', href: '/profil', icon: IdCard },
    ]
};
