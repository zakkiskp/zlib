import { useEffect, useRef, useState } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
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
} from 'lucide-react';

/**
 * Butuh package: npm install html5-qrcode
 */
import { Html5Qrcode } from 'html5-qrcode';

const SCANNER_ELEMENT_ID = 'zlib-qr-reader';

function resolveAvatar(path) {
  if (!path) return null;
  return /^https?:\/\//i.test(path) ? path : `/storage/${path}`;
}

function ResultCard({ result }) {
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
          <p className="font-semibold text-red-600 dark:text-red-400 text-sm">Kode Tidak Dikenali</p>
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
              <img src={resolveAvatar(m.avatar_url)} className="w-full h-full object-cover" alt="" />
            ) : (
              m.name?.charAt(0)
            )}
          </div>
          <div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mb-0.5">
              <IdCard className="w-3 h-3" /> Anggota Terverifikasi
            </span>
            <p className="font-semibold text-ink">{m.name}</p>
            <p className="text-xs text-muted">
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
        <div className="w-14 h-20 rounded-lg overflow-hidden bg-surface2 shrink-0">
          {b.cover_url && <img src={b.cover_url} className="w-full h-full object-cover" alt="" />}
        </div>
        <div>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent mb-0.5">
            <BookOpen className="w-3 h-3" /> Buku Ditemukan
          </span>
          <p className="font-semibold text-ink">{b.judul_buku}</p>
          <p className="text-xs text-muted">{b.penulis}</p>
          <p className="text-xs mt-1 text-muted">
            Stok: <span className="font-semibold">{b.stok_tersedia}</span> / {b.total_stok}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function QrScannerIndex() {
  const [tab, setTab] = useState('camera'); // 'camera' | 'manual'
  const [manualCode, setManualCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [cameraError, setCameraError] = useState(null);

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
      const data = err.response?.data || { found: false, message: 'Terjadi kesalahan saat memproses kode.' };
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

  useEffect(() => {
    if (tab !== 'camera') {
      stopCamera();
      return;
    }

    const qr = new Html5Qrcode(SCANNER_ELEMENT_ID);
    html5QrRef.current = qr;
    setCameraError(null);

    qr.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 240, height: 240 } },
      (decodedText) => {
        if (isScanningRef.current) return; // debounce, hindari trigger beruntun
        isScanningRef.current = true;
        processCode(decodedText).finally(() => {
          setTimeout(() => {
            isScanningRef.current = false;
          }, 1500);
        });
      },
      () => {} // abaikan noise "QR tidak ditemukan" per-frame
    ).catch((err) => {
      setCameraError('Kamera tidak dapat diakses. Gunakan tab Input Manual sebagai gantinya.');
      console.error(err);
    });

    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  function submitManual(e) {
    e.preventDefault();
    processCode(manualCode.trim());
  }

  return (
    <AuthenticatedLayout>
      <Head title="QR Scanner" />

      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
            <ScanLine className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-ink">Quick QR Code Scanner</h1>
            <p className="text-sm text-muted">
              Scan E-KTA anggota atau kode buku untuk proses sirkulasi kilat.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="inline-flex rounded-xl bg-surface2 p-1 border border-border/60 mb-5">
          <button
            onClick={() => setTab('camera')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              tab === 'camera' ? 'bg-surface text-ink shadow-sm' : 'text-muted'
            }`}
          >
            <Camera className="w-4 h-4" /> Scan Kamera
          </button>
          <button
            onClick={() => setTab('manual')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              tab === 'manual' ? 'bg-surface text-ink shadow-sm' : 'text-muted'
            }`}
          >
            <Keyboard className="w-4 h-4" /> Input Manual
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Scanner / Manual input */}
          <div className="rounded-2xl border border-border/70 bg-surface/70 backdrop-blur-md p-5">
            {tab === 'camera' ? (
              <div>
                <div id={SCANNER_ELEMENT_ID} className="rounded-xl overflow-hidden bg-zinc-900 aspect-square" />
                {cameraError && (
                  <p className="mt-3 text-xs text-red-500 flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5" /> {cameraError}
                  </p>
                )}
                <p className="mt-3 text-xs text-muted">Arahkan kamera ke QR Code E-KTA anggota atau label buku.</p>
              </div>
            ) : (
              <form onSubmit={submitManual} className="space-y-3">
                <label className="block text-xs font-medium text-muted">
                  Masukkan kode E-KTA / ISBN
                </label>
                <input
                  type="text"
                  autoFocus
                  placeholder="Contoh: ZLIB-MEMBER:12 atau 978-xxxxxxx"
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
                  Proses Kode
                </button>
              </form>
            )}
          </div>

          {/* Result + history */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {result ? (
                <ResultCard key={JSON.stringify(result)} result={result} />
              ) : (
                <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted text-sm">
                  Hasil scan akan tampil di sini.
                </div>
              )}
            </AnimatePresence>

            {history.length > 0 && (
              <div className="rounded-2xl border border-border/70 bg-surface/70 backdrop-blur-md p-4">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-muted mb-2">
                  <History className="w-3.5 h-3.5" /> Riwayat Scan Sesi Ini
                </p>
                <ul className="space-y-1.5 max-h-48 overflow-y-auto">
                  {history.map((h, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between text-xs text-muted border-b border-border/50 pb-1.5 last:border-0"
                    >
                      <span className="truncate max-w-[60%] font-mono">{h.code}</span>
                      <span className={h.data.found ? 'text-emerald-500' : 'text-red-500'}>
                        {h.data.found ? (h.data.type === 'member' ? 'Anggota' : 'Buku') : 'Tidak ditemukan'}
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
