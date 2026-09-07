import { useEffect, useRef, useState } from 'react';

import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SearchableSelect from '@/Components/SearchableSelect';
import BookCover from '@/Components/BookCover';
import { useLanguage } from '@/Contexts/LanguageContext';
import { resolveMediaUrl } from '@/Utils/ui';
import {
  ScanLine,
  Keyboard,
  Camera,
  BookOpen,
  IdCard,
  CheckCircle2,
  XCircle,
  Loader2,
  History,
  Video,
} from 'lucide-react';

/**
 * Butuh package: npm install html5-qrcode
 */
import { Html5Qrcode } from 'html5-qrcode';

const SCANNER_ELEMENT_ID = 'zlib-qr-reader';
const LAST_CAMERA_KEY = 'zlib_qr_last_camera';

/**
 * FIX BUG (foto profil kosong / 404 saat scan atau input manual):
 * Halaman ini sebelumnya punya resolveAvatar() versi sendiri yang cuma
 * menempelkan "/storage/" di depan path mentah. Masalahnya, avatar_url
 * di database TIDAK konsisten formatnya tergantung siapa yang meng-upload:
 *   - Upload lewat profil Anggota/Petugas sendiri -> sudah tersimpan
 *     sebagai "/storage/avatars/xxx.jpg" (pakai Storage::url()).
 *   - Upload lewat Admin (ProfileSettingController) -> tersimpan sebagai
 *     path mentah "avatars/xxx.jpg" (tanpa "/storage/").
 *   - Data seeder -> URL eksternal penuh (https://i.pravatar.cc/...).
 * resolveAvatar() versi lama menempelkan "/storage/" ke SEMUA path yang
 * bukan http(s), jadi untuk kasus pertama hasilnya jadi dobel:
 * "/storage//storage/avatars/xxx.jpg" -> file tidak ditemukan (404) ->
 * foto kelihatan kosong. Ini persis kasus yang muncul saat kode member
 * di-input manual (member yang avatar-nya diupload sendiri dari halaman
 * Profil). Solusinya: pakai resolveMediaUrl() bersama dari Utils/ui.js
 * yang sudah dipakai & terbukti benar di UserMenu, Sidebar, Admin/User,
 * dan Admin/AuditLog — fungsi ini mengambil NAMA FILE saja lalu membangun
 * ulang path kanonik "/storage/avatars/{filename}", jadi konsisten untuk
 * ketiga format di atas.
 */

function ResultCard({ result, t }) {
  if (!result) return null;

  if (!result.found) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 flex items-center gap-3"
      >
        <XCircle className="w-6 h-6 text-red-500 shrink-0" />
        <div>
          <p className="font-semibold text-red-600 dark:text-red-400 text-sm">{t('qrscanner.result.notFound.title')}</p>
          <p className="text-xs text-red-500/80 mt-0.5">{result.message}</p>
        </div>
      </motion.div>
    );
  }

  if (result.type === 'member') {
    const m = result.data;
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-surface2 shrink-0 flex items-center justify-center font-bold text-muted">
            {m.avatar_url ? (
              <img src={resolveMediaUrl(m.avatar_url)} className="w-full h-full object-cover" alt="" />
            ) : (
              m.name?.charAt(0)
            )}
          </div>
          <div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mb-0.5">
              <IdCard className="w-3 h-3" /> {t('qrscanner.result.member.verified')}
            </span>
            <p className="font-semibold text-ink">{m.name}</p>
            <p className="text-xs text-muted">
              {m.no_anggota && <>{m.no_anggota} &bull; </>}
              {m.email} &bull; <span className="capitalize">{m.role}</span>
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  const b = result.data;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-accent/30 bg-accent/5 p-5"
    >
      <div className="flex items-center gap-4">
        {/* FIX BUG (fallback cover archive.org/openlibrary yang error):
            sebelumnya <img> mentah di sini tidak punya penanganan error
            sama sekali — kalau cover_url mati (mis. ERR_NAME_NOT_RESOLVED
            saat offline), yang tampil cuma ikon "gambar rusak" bawaan
            browser. BookCover sudah lebih dulu punya onError + placeholder
            yang dipakai konsisten di 12 tempat lain di app ini (Katalog,
            Admin Data Buku, dll) — di sini tinggal disamakan. */}
        <div className="w-14 h-20 rounded-lg overflow-hidden bg-surface2 shrink-0">
          {b.cover_url && <BookCover src={b.cover_url} alt={b.judul_buku} className="w-full h-full" />}
        </div>
        <div>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent mb-0.5">
            <BookOpen className="w-3 h-3" /> {t('qrscanner.result.book.found')}
          </span>
          <p className="font-semibold text-ink">{b.judul_buku}</p>
          <p className="text-xs text-muted">{b.penulis}</p>
          <p className="text-xs mt-1 text-ink">
            {t('qrscanner.result.book.stock')}: <span className="font-semibold">{b.stok_tersedia}</span> / {b.total_stok}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function QrScannerIndex() {
  const { t } = useLanguage();
  const [tab, setTab] = useState('camera'); // 'camera' | 'manual'
  const [manualCode, setManualCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [cameraError, setCameraError] = useState(null);

  // TASK #5 — deteksi & pilih kamera (fix "hanya hitam/error" di laptop):
  // sebelumnya scanner minta { facingMode: 'environment' } yang murni
  // konsep HP (kamera depan/belakang). Webcam laptop umumnya tidak
  // melaporkan facingMode itu sama sekali, jadi getUserMedia gagal total
  // -> muncul error/hitam. Sekarang kita enumerasi device kamera yang
  // benar-benar ada lewat Html5Qrcode.getCameras(), lalu start scanner
  // pakai deviceId spesifik — ini jalan di HP MAUPUN laptop/webcam USB.
  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState(null);
  const [camerasLoading, setCamerasLoading] = useState(false);

  const html5QrRef = useRef(null);
  const isScanningRef = useRef(false);

  async function processCode(code) {
    if (!code || loading) return;
    setLoading(true);
    try {
      const { data } = await axios.post(route('petugas.qr-scanner.proses'), { code });
      setResult(data);
      setHistory((h) => [{ code, data, time: new Date() }, ...h].slice(0, 8));
    } catch (err) {
      const data = err.response?.data || { found: false, message: t('qrscanner.result.notFound.title') };
      setResult(data);
    } finally {
      setLoading(false);
    }
  }

  function stopCamera() {
    const qr = html5QrRef.current;
    if (qr && qr.isScanning) {
      qr.stop().then(() => qr.clear()).catch(() => {});
    }
    html5QrRef.current = null;
  }

  // Langkah 1: begitu tab "Scan Kamera" dibuka, enumerasi kamera yang ada
  useEffect(() => {
    if (tab !== 'camera') return;

    setCamerasLoading(true);
    setCameraError(null);

    Html5Qrcode.getCameras()
      .then((devices) => {
        setCameras(devices);
        if (!devices || devices.length === 0) {
          setCameraError(t('qrscanner.camera.noDevice'));
          return;
        }
        const lastUsed = localStorage.getItem(LAST_CAMERA_KEY);
        const preferred = devices.find((d) => d.id === lastUsed) || devices[0];
        setSelectedCameraId(preferred.id);
      })
      .catch((err) => {
        setCameraError(t('qrscanner.camera.permissionDenied'));
        console.error(err);
      })
      .finally(() => setCamerasLoading(false));

    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  // Langkah 2: start/restart scanner setiap kali kamera yang dipilih berubah
  useEffect(() => {
    if (tab !== 'camera' || !selectedCameraId) return;

    stopCamera();
    const qr = new Html5Qrcode(SCANNER_ELEMENT_ID);
    html5QrRef.current = qr;

    qr.start(
      selectedCameraId,
      { fps: 10, qrbox: { width: 240, height: 240 } },
      (decodedText) => {
        if (isScanningRef.current) return;
        isScanningRef.current = true;
        processCode(decodedText).finally(() => {
          setTimeout(() => {
            isScanningRef.current = false;
          }, 1500);
        });
      },
      () => {}
    )
      .then(() => {
        localStorage.setItem(LAST_CAMERA_KEY, selectedCameraId);
      })
      .catch((err) => {
        setCameraError(t('qrscanner.camera.error'));
        console.error(err);
      });

    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCameraId, tab]);

  function submitManual(e) {
    e.preventDefault();
    processCode(manualCode.trim());
  }

  const cameraOptions = cameras.map((c, i) => ({
    value: c.id,
    label: c.label || `${t('qrscanner.camera.label')} ${i + 1}`,
  }));

  return (
    <AuthenticatedLayout titleKey="qrscanner.title">

      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
            <ScanLine className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-ink">{t('qrscanner.title')}</h1>
            <p className="text-sm text-muted">{t('qrscanner.subtitle')}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="inline-flex rounded-xl bg-surface2 p-1 border border-border/60 mb-5">
          <button
            onClick={() => setTab('camera')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${tab === 'camera' ? 'bg-surface text-ink shadow-sm' : 'text-muted'}`}
          >
            <Camera className="w-4 h-4" /> {t('qrscanner.tab.camera')}
          </button>
          <button
            onClick={() => setTab('manual')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${tab === 'manual' ? 'bg-surface text-ink shadow-sm' : 'text-muted'}`}
          >
            <Keyboard className="w-4 h-4" /> {t('qrscanner.tab.manual')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Scanner / Manual input */}
          <div className="rounded-2xl border border-border/70 bg-surface/70 backdrop-blur-md p-5">
            {tab === 'camera' ? (
              <div>
                {cameras.length > 1 && (
                  <div className="mb-3">
                    <label className="flex items-center gap-1.5 text-xs font-medium text-muted mb-1.5">
                      <Video className="w-3.5 h-3.5" /> {t('qrscanner.camera.select')}
                    </label>
                    <SearchableSelect
                      value={selectedCameraId}
                      onChange={setSelectedCameraId}
                      options={cameraOptions}
                      searchPlaceholder={t('common.search')}
                      emptyText={t('common.noResults')}
                    />
                  </div>
                )}

                <div id={SCANNER_ELEMENT_ID} className="rounded-xl overflow-hidden bg-zinc-900 aspect-square" />

                {camerasLoading && (
                  <p className="mt-3 text-xs text-muted flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> {t('qrscanner.camera.detecting')}
                  </p>
                )}
                {cameraError && (
                  <p className="mt-3 text-xs text-red-500 flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5" /> {cameraError}
                  </p>
                )}
                <p className="mt-3 text-xs text-muted">{t('qrscanner.camera.hint')}</p>
              </div>
            ) : (
              <form onSubmit={submitManual} className="space-y-3">
                <label className="block text-xs font-medium text-muted">{t('qrscanner.manual.label')}</label>
                <input
                  type="text"
                  autoFocus
                  placeholder="ZLIB-MEMBER:12 / 978-xxxxxxx"
                  className="w-full rounded-lg bg-base border border-border px-3.5 py-2.5 text-sm text-ink shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={loading || !manualCode.trim()}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm font-semibold text-white shadow-glow-accent hover:brightness-110 disabled:opacity-50 transition-all"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  {t('qrscanner.manual.process')}
                </button>
              </form>
            )}
          </div>

          {/* Result + history */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {result ? (
                <ResultCard key={JSON.stringify(result)} result={result} t={t} />
              ) : (
                <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted text-sm">
                  {t('qrscanner.result.placeholder')}
                </div>
              )}
            </AnimatePresence>

            {history.length > 0 && (
              <div className="rounded-2xl border border-border/70 bg-surface/70 backdrop-blur-md p-4">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-muted mb-2">
                  <History className="w-3.5 h-3.5" /> {t('qrscanner.history.title')}
                </p>
                <ul className="space-y-1.5 max-h-48 overflow-y-auto">
                  {history.map((h, i) => (
                    <li key={i} className="flex items-center justify-between text-xs text-muted border-b border-border/50 pb-1.5 last:border-0">
                      <span className="truncate max-w-[60%] font-mono">{h.code}</span>
                      <span className={h.data.found ? 'text-emerald-500' : 'text-red-500'}>
                        {h.data.found ? (h.data.type === 'member' ? t('qrscanner.history.member') : t('qrscanner.history.book')) : t('qrscanner.history.notfound')}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
