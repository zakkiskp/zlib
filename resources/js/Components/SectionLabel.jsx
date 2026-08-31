/**
 * Label kecil "eyebrow" untuk mengelompokkan bagian-bagian Dashboard
 * secara visual (Ringkasan / Analitik / Operasional / dst) — biar user
 * langsung paham struktur halaman sekilas pandang, bukan cuma tumpukan
 * kartu tanpa konteks. Dipakai di AdminDashboard, PetugasDashboard, dan
 * AnggotaDashboard.
 */
export default function SectionLabel({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2 mb-1 first:mt-0 mt-2">
      {Icon && <Icon size={13} className="text-muted" />}
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{children}</p>
    </div>
  );
}
