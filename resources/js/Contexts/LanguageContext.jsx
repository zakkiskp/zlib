import { createContext, useContext, useEffect, useState } from 'react';

/**
 * FITUR MULTI-LANGUAGE (ID/EN) — sederhana, berbasis React Context.
 *
 * Cara pakai di komponen manapun:
 *   import { useLanguage } from '@/Contexts/LanguageContext';
 *   const { t, lang, setLang } = useLanguage();
 *   <h1>{t('profile.title')}</h1>
 *
 * Untuk menambah teks baru: tambahkan key yang sama di objek `id` DAN `en`
 * di bawah, lalu panggil t('key.baru') di komponen.
 */

const translations = {
  id: {
    // Halaman Profil & System Settings (Admin)
    'profile.title': 'Profil & Core System Settings',
    'profile.subtitle': 'Kelola identitas akun Anda dan konfigurasi inti sistem Z-Lib.',
    'profile.tab.profil': 'Profil',
    'profile.tab.sistem': 'Sistem',
    'profile.account.title': 'Informasi Akun',
    'profile.account.name': 'Nama Lengkap',
    'profile.account.email': 'Email (@gmail.com)',
    'profile.password.title': 'Ganti Password',
    'profile.password.current': 'Password Saat Ini',
    'profile.password.new': 'Password Baru',
    'profile.password.confirm': 'Konfirmasi Password',
    'profile.password.save': 'Update Password',
    'profile.save': 'Simpan Perubahan',
    'profile.saving': 'Menyimpan...',
    'profile.badge.admin': 'Administrator',
    'profile.language.title': 'Preferensi Bahasa',
    'profile.language.desc': 'Pilih bahasa antarmuka yang ingin Anda gunakan di seluruh Z-Lib.',
    'profile.system.identity': 'Identitas Web',
    'profile.system.sitename': 'Nama Website',
    'profile.system.logo': 'Ganti Logo',
    'profile.system.denda.title': 'Denda Keterlambatan',
    'profile.system.denda.label': 'Tarif Denda per Hari (Rp)',
    'profile.system.durasi.title': 'Durasi & Batas Pinjam',
    'profile.system.durasi.label': 'Durasi Maksimal Pinjam (hari)',
    'profile.system.maksbuku.label': 'Maks. Buku Dipinjam Bersamaan',
    'profile.system.save': 'Simpan Pengaturan Sistem',

    // Auth
    'auth.login.title': 'Selamat Datang Kembali',
    'auth.login.subtitle': 'Masuk untuk melanjutkan ke Z-Lib.',
    'auth.login.email': 'Email (@gmail.com)',
    'auth.login.password': 'Password',
    'auth.login.remember': 'Ingat saya',
    'auth.login.forgot': 'Lupa password?',
    'auth.login.submit': 'Masuk',
    'auth.login.noaccount': 'Belum punya akun?',
    'auth.login.register': 'Daftar sekarang',
    'auth.register.title': 'Buat Akun Baru',
    'auth.register.subtitle': 'Daftar sebagai anggota untuk mulai meminjam buku di Z-Lib.',
    'auth.register.name': 'Nama Lengkap',
    'auth.register.submit': 'Daftar Sekarang',
    'auth.register.haveaccount': 'Sudah punya akun?',
    'auth.register.login': 'Masuk di sini',

    // Navigasi global (Sidebar / Topbar / BottomNav) — dipakai SEMUA role
    'nav.search.placeholder': 'Cari buku, anggota, transaksi...',
    'nav.more': 'Lainnya',
    'nav.more.title': 'Menu Lainnya',
    'nav.logout': 'Keluar',
    'nav.collapse': 'Ciutkan',
    'nav.expand': 'Perluas',

    // Nama section sidebar (dipakai lintas role, makanya dikumpulkan di sini)
    'nav.section.utama': 'Utama',
    'nav.section.masterdata': 'Master Data',
    'nav.section.manajemenlaporan': 'Manajemen & Laporan',
    'nav.section.akun': 'Akun',
    'nav.section.sirkulasi': 'Sirkulasi',
    'nav.section.katalog': 'Katalog',
    'nav.section.peminjaman': 'Peminjaman',

    // Label menu Sidebar (dipakai Admin, Petugas, Anggota — lihat navigation.js)
    'nav.menu.dashboard': 'Dashboard',
    'nav.menu.masterbuku': 'Master Data Buku',
    'nav.menu.kategoritaxonomi': 'Kategori & Taxonomi',
    'nav.menu.userrole': 'User & Role',
    'nav.menu.pengaturandenda': 'Pengaturan Denda',
    'nav.menu.laporanbi': 'Laporan & BI',
    'nav.menu.auditlog': 'Audit Log',
    'nav.menu.pengumuman': 'Pengumuman',
    'nav.menu.profilsistem': 'Profil & Sistem',
    'nav.menu.qrscanner': 'QR Scanner',
    'nav.menu.circulationdesk': 'Circulation Desk',
    'nav.menu.dendapembayaran': 'Denda & Pembayaran',
    'nav.menu.databuku': 'Data Buku',
    'nav.menu.kategorirak': 'Kategori & Rak',
    'nav.menu.preservasibuku': 'Preservasi Buku',
    'nav.menu.laporansirkulasi': 'Laporan Sirkulasi',
    'nav.menu.profilshift': 'Profil & Shift',
    'nav.menu.katalogbuku': 'Katalog Buku',
    'nav.menu.peminjamansaya': 'Peminjaman Saya',
    'nav.menu.koleksipribadi': 'Koleksi Pribadi',
    'nav.menu.ulasansaya': 'Ulasan Saya',
    'nav.menu.profilekta': 'Profil & E-KTA',

    // Label menu BottomNav (versi singkat khusus HP — berbeda dari Sidebar)
    'nav.bottom.dashboard': 'Dashboard',
    'nav.bottom.databuku': 'Data Buku',
    'nav.bottom.auditlog': 'Audit Log',
    'nav.bottom.profil': 'Profil',
    'nav.bottom.scanner': 'Scanner',
    'nav.bottom.sirkulasi': 'Sirkulasi',
    'nav.bottom.beranda': 'Beranda',
    'nav.bottom.katalog': 'Katalog',
    'nav.bottom.pinjaman': 'Pinjaman',
  },
  en: {
    'profile.title': 'Profile & Core System Settings',
    'profile.subtitle': 'Manage your account identity and Z-Lib core system configuration.',
    'profile.tab.profil': 'Profile',
    'profile.tab.sistem': 'System',
    'profile.account.title': 'Account Information',
    'profile.account.name': 'Full Name',
    'profile.account.email': 'Email (@gmail.com)',
    'profile.password.title': 'Change Password',
    'profile.password.current': 'Current Password',
    'profile.password.new': 'New Password',
    'profile.password.confirm': 'Confirm Password',
    'profile.password.save': 'Update Password',
    'profile.save': 'Save Changes',
    'profile.saving': 'Saving...',
    'profile.badge.admin': 'Administrator',
    'profile.language.title': 'Language Preference',
    'profile.language.desc': 'Choose the interface language you want to use across Z-Lib.',
    'profile.system.identity': 'Site Identity',
    'profile.system.sitename': 'Website Name',
    'profile.system.logo': 'Change Logo',
    'profile.system.denda.title': 'Late Return Fine',
    'profile.system.denda.label': 'Fine Rate per Day (Rp)',
    'profile.system.durasi.title': 'Loan Duration & Limits',
    'profile.system.durasi.label': 'Maximum Loan Duration (days)',
    'profile.system.maksbuku.label': 'Max Books Borrowed at Once',
    'profile.system.save': 'Save System Settings',

    'auth.login.title': 'Welcome Back',
    'auth.login.subtitle': 'Sign in to continue to Z-Lib.',
    'auth.login.email': 'Email (@gmail.com)',
    'auth.login.password': 'Password',
    'auth.login.remember': 'Remember me',
    'auth.login.forgot': 'Forgot password?',
    'auth.login.submit': 'Sign In',
    'auth.login.noaccount': "Don't have an account?",
    'auth.login.register': 'Register now',
    'auth.register.title': 'Create New Account',
    'auth.register.subtitle': 'Sign up as a member to start borrowing books on Z-Lib.',
    'auth.register.name': 'Full Name',
    'auth.register.submit': 'Register Now',
    'auth.register.haveaccount': 'Already have an account?',
    'auth.register.login': 'Sign in here',

    'nav.search.placeholder': 'Search books, members, transactions...',
    'nav.more': 'More',
    'nav.more.title': 'More Menu',
    'nav.logout': 'Log Out',
    'nav.collapse': 'Collapse',
    'nav.expand': 'Expand',

    'nav.section.utama': 'Main',
    'nav.section.masterdata': 'Master Data',
    'nav.section.manajemenlaporan': 'Management & Reports',
    'nav.section.akun': 'Account',
    'nav.section.sirkulasi': 'Circulation',
    'nav.section.katalog': 'Catalog',
    'nav.section.peminjaman': 'Loans',

    'nav.menu.dashboard': 'Dashboard',
    'nav.menu.masterbuku': 'Book Master Data',
    'nav.menu.kategoritaxonomi': 'Category & Taxonomy',
    'nav.menu.userrole': 'Users & Roles',
    'nav.menu.pengaturandenda': 'Fine Settings',
    'nav.menu.laporanbi': 'Reports & BI',
    'nav.menu.auditlog': 'Audit Log',
    'nav.menu.pengumuman': 'Announcements',
    'nav.menu.profilsistem': 'Profile & System',
    'nav.menu.qrscanner': 'QR Scanner',
    'nav.menu.circulationdesk': 'Circulation Desk',
    'nav.menu.dendapembayaran': 'Fines & Payments',
    'nav.menu.databuku': 'Book Data',
    'nav.menu.kategorirak': 'Categories & Shelves',
    'nav.menu.preservasibuku': 'Book Preservation',
    'nav.menu.laporansirkulasi': 'Circulation Report',
    'nav.menu.profilshift': 'Profile & Shift',
    'nav.menu.katalogbuku': 'Book Catalog',
    'nav.menu.peminjamansaya': 'My Loans',
    'nav.menu.koleksipribadi': 'Personal Collection',
    'nav.menu.ulasansaya': 'My Reviews',
    'nav.menu.profilekta': 'Profile & Member Card',

    'nav.bottom.dashboard': 'Dashboard',
    'nav.bottom.databuku': 'Books',
    'nav.bottom.auditlog': 'Audit Log',
    'nav.bottom.profil': 'Profile',
    'nav.bottom.scanner': 'Scanner',
    'nav.bottom.sirkulasi': 'Circulation',
    'nav.bottom.beranda': 'Home',
    'nav.bottom.katalog': 'Catalog',
    'nav.bottom.pinjaman': 'Loans',
  },
};

const LanguageContext = createContext(null);
const STORAGE_KEY = 'zlib_lang';

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    if (typeof window === 'undefined') return 'id';
    return localStorage.getItem(STORAGE_KEY) || 'id';
  });

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  function setLang(next) {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (e) {
      // storage penuh/diblokir browser — abaikan, cukup state React yang jalan
    }
  }

  function t(key) {
    return translations[lang]?.[key] ?? translations.id[key] ?? key;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage() harus dipakai di dalam <LanguageProvider>. Lihat README untuk cara wrap root app.');
  }
  return ctx;
}
