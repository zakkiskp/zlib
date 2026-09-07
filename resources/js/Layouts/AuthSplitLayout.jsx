import { useRef } from 'react';
import { Link } from '@inertiajs/react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { BookOpen, Users, ShieldCheck, QrCode, BarChart3, Bell, Sparkles } from 'lucide-react';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import ThemeSwitcher from '@/Components/Navigation/ThemeSwitcher';
import useIsMobile from '@/Hooks/useIsMobile';

/**
 * Layout mandiri untuk halaman Login & Register — TIDAK bergantung pada
 * GuestLayout.jsx (sudah dihapus dari project). Fungsionalitas auth tetap
 * dipegang penuh oleh masing-masing Page lewat useForm() Inertia; layout
 * ini murni visual.
 *
 * REVISI v2: animasi orbit dibuat jauh lebih hidup —
 * - 7 ikon melayang (bukan 5), radius/kecepatan/arah bervariasi (sebagian
 *   searah jarum jam, sebagian berlawanan)
 * - 3 cincin "ping" memancar dari lambang pusat seperti radar
 * - partikel kecil berkelip tersebar (starfield effect)
 * - parallax halus mengikuti gerakan mouse (framer-motion)
 * - badge teks "Enterprise Digital Library ERP" DIHAPUS TOTAL sesuai instruksi
 */
const ORBIT_ICONS = [
  { icon: BookOpen, radius: 100, duration: 16, delay: 0, size: 'w-10 h-10', angle: 0, reverse: false },
  { icon: Users, radius: 145, duration: 22, delay: -4, size: 'w-8 h-8', angle: 51, reverse: true },
  { icon: ShieldCheck, radius: 100, duration: 16, delay: -8, size: 'w-9 h-9', angle: 103, reverse: false },
  { icon: QrCode, radius: 180, duration: 28, delay: -2, size: 'w-7 h-7', angle: 154, reverse: true },
  { icon: BarChart3, radius: 145, duration: 22, delay: -12, size: 'w-8 h-8', angle: 206, reverse: true },
  { icon: Bell, radius: 100, duration: 16, delay: -5, size: 'w-7 h-7', angle: 257, reverse: false },
  { icon: Sparkles, radius: 180, duration: 28, delay: -18, size: 'w-8 h-8', angle: 309, reverse: true },
];

const PARTICLES = [
  { top: '12%', left: '18%', delay: 0, size: 3 },
  { top: '22%', left: '78%', delay: 0.5, size: 2 },
  { top: '68%', left: '85%', delay: 1.1, size: 3 },
  { top: '80%', left: '15%', delay: 0.3, size: 2 },
  { top: '45%', left: '8%', delay: 1.6, size: 2 },
  { top: '10%', left: '55%', delay: 0.9, size: 2 },
  { top: '88%', left: '55%', delay: 1.3, size: 3 },
  { top: '35%', left: '92%', delay: 0.2, size: 2 },
  { top: '58%', left: '30%', delay: 1.8, size: 2 },
  { top: '5%', left: '35%', delay: 0.7, size: 2 },
];

export default function AuthSplitLayout({ children, title, description }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-150, 150], [10, -10]);
  const rotateY = useTransform(mouseX, [-150, 150], [-10, 10]);
  const panelRef = useRef(null);
  // FIX (animasi transisi halus khusus mobile): dipakai untuk cascading
  // fade-in bertahap (header -> judul -> form) HANYA di layar mobile.
  // Desktop sengaja dibiarkan seperti semula (initial={false} di bawah)
  // supaya tidak mengubah tampilan yang sudah ada di sana.
  const isMobile = useIsMobile();

  function handleMouseMove(e) {
    const rect = panelRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <div className="min-h-screen flex bg-base">
      <style>{`
        @keyframes zlib-orbit {
          from { transform: rotate(0deg) translateX(var(--orbit-radius)) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(var(--orbit-radius)) rotate(-360deg); }
        }
        @keyframes zlib-pulse-glow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes zlib-ping-ring {
          0% { transform: scale(0.85); opacity: 0.5; }
          100% { transform: scale(2.8); opacity: 0; }
        }
        @keyframes zlib-blob-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(26px, -20px) scale(1.08); }
          66% { transform: translate(-20px, 24px) scale(0.92); }
        }
        @keyframes zlib-grid-pan {
          from { background-position: 0 0; }
          to { background-position: 48px 48px; }
        }
        @keyframes zlib-twinkle {
          0%, 100% { opacity: 0.15; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.4); }
        }
        .zlib-orbit-item {
          animation-name: zlib-orbit;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-duration: var(--orbit-duration);
          animation-delay: var(--orbit-delay);
          animation-direction: var(--orbit-direction, normal);
        }
      `}</style>

      {/* Sisi Kiri — Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12 overflow-y-auto">
        <div className="w-full max-w-sm mx-auto">
          <motion.div
            initial={isMobile ? { opacity: 0, y: -10 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-between mb-10"
          >
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center text-white font-bold text-sm shadow-glow-accent">
                ZL
              </div>
              <span className="font-bold text-lg text-ink">Z-Lib</span>
            </Link>
            {/* TASK #3: Theme Switcher + Language Switcher berdampingan di
                pojok kanan atas — bisa ganti tema & bahasa SEBELUM login. */}
            <div className="flex items-center gap-2">
              <ThemeSwitcher />
              <LanguageSwitcher />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: isMobile ? 0.12 : 0, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-2xl font-bold text-ink">{title}</h1>
            {description && <p className="mt-1.5 text-sm text-muted">{description}</p>}
            <motion.div
              initial={isMobile ? { opacity: 0, y: 14 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: isMobile ? 0.22 : 0, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8"
            >
              {children}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Sisi Kanan — Visual Animasi (disembunyikan di mobile) */}
      <div
        ref={panelRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="hidden lg:flex flex-1 relative overflow-hidden bg-zinc-900"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-zinc-900 to-zinc-950" />

        {/* Grid tekstur bergerak halus */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            animation: 'zlib-grid-pan 6s linear infinite',
          }}
        />

        {/* Blob gradient drift */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-accent/30 blur-3xl"
          style={{ animation: 'zlib-blob-drift 12s ease-in-out infinite' }}
        />
        <div
          className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-accent/20 blur-3xl"
          style={{ animation: 'zlib-blob-drift 14s ease-in-out infinite reverse' }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-white/5 blur-3xl"
          style={{ animation: 'zlib-blob-drift 18s ease-in-out infinite' }}
        />

        {/* Partikel berkelip */}
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              animation: `zlib-twinkle ${2.4 + p.delay}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}

        {/* Orbit lambang Z-Lib + ikon melayang, dengan parallax mouse */}
        <div className="relative z-10 flex-1 flex items-center justify-center" style={{ perspective: 900 }}>
          <motion.div
            style={{ rotateX, rotateY }}
            className="relative w-[360px] h-[360px] flex items-center justify-center"
          >
            {/* Cincin ping memancar dari pusat */}
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute w-20 h-20 rounded-2xl border-2 border-accent/50"
                style={{
                  animation: 'zlib-ping-ring 3.6s cubic-bezier(0.2,0.6,0.4,1) infinite',
                  animationDelay: `${i * 1.2}s`,
                }}
              />
            ))}

            {/* Lambang pusat */}
            <div
              className="absolute w-20 h-20 rounded-2xl bg-accent/90 backdrop-blur-md flex items-center justify-center text-white font-bold text-2xl shadow-2xl z-10"
              style={{ animation: 'zlib-pulse-glow 4s ease-in-out infinite' }}
            >
              ZL
            </div>

            {/* Cincin orbit tipis, dekoratif */}
            <div className="absolute w-[220px] h-[220px] rounded-full border border-white/10" />
            <div className="absolute w-[300px] h-[300px] rounded-full border border-white/[0.06]" />
            <div className="absolute w-[360px] h-[360px] rounded-full border border-white/[0.04]" />

            {/* Ikon-ikon melayang mengorbit */}
            {ORBIT_ICONS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="absolute zlib-orbit-item"
                  style={{
                    '--orbit-radius': `${item.radius}px`,
                    '--orbit-duration': `${item.duration}s`,
                    '--orbit-delay': `${item.delay}s`,
                    '--orbit-direction': item.reverse ? 'reverse' : 'normal',
                    transform: `rotate(${item.angle}deg) translateX(${item.radius}px)`,
                  }}
                >
                  <div
                    className={`${item.size} rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white shadow-lg`}
                  >
                    <Icon className="w-1/2 h-1/2" />
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
