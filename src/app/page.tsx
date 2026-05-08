import Link from "next/link";
import { Wrench, Calendar, BarChart3, Shield, Clock, Users, ChevronRight, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="bg-cover-wrapper">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" className="landing-logo">
            <Wrench size={24} color="var(--accent)" strokeWidth={2.5} />
            FixIt
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Link href="/login" className="btn btn-secondary btn-sm" style={{ border: "none", background: "transparent" }}>Masuk</Link>
            <Link href="/register" className="btn btn-primary btn-sm" style={{ borderRadius: "20px", padding: "8px 20px" }}>Daftar Sekarang</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <Zap size={14} fill="var(--accent)" /> Sistem Manajemen Bengkel Modern
            </div>
            <h1>
              Servis Kendaraan,<br/>
              <span style={{ color: "var(--accent)" }}>Makin Mudah & Cepat.</span>
            </h1>
            <p>Platform lengkap untuk pemesanan servis kendaraan secara online. Pilih spesialis mekanik Anda, dan pantau status pengerjaan secara real-time dari mana saja.</p>
            <div className="hero-buttons">
              <Link href="/register" className="btn btn-primary btn-lg" style={{ borderRadius: "30px", padding: "16px 32px" }}>
                Mulai Booking <ChevronRight size={18} />
              </Link>
              <Link href="/login" className="btn btn-secondary btn-lg" style={{ borderRadius: "30px", padding: "16px 32px", background: "rgba(30, 41, 59, 0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
                Masuk Dasbor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <h2>Fitur <span style={{ color: "var(--accent)" }}>Unggulan</span></h2>
          <p className="subtitle">Segala kebutuhan operasional bengkel dirancang dalam satu platform pintar yang memanjakan mata dan mudah digunakan.</p>
          <div className="features-grid">
            {[
              { icon: <Calendar size={26} strokeWidth={1.5} />, title: "Booking Pintar", desc: "Reservasi jadwal otomatis yang sinkron dengan ketersediaan mekanik bengkel." },
              { icon: <Users size={26} strokeWidth={1.5} />, title: "Pilih Mekanik", desc: "Kebebasan memilih teknisi spesialis untuk menangani kendaraan Anda." },
              { icon: <Clock size={26} strokeWidth={1.5} />, title: "Live Tracking", desc: "Pantau setiap tahapan perbaikan kendaraan Anda secara real-time." },
              { icon: <BarChart3 size={26} strokeWidth={1.5} />, title: "Dasbor Admin", desc: "Analisis performa, pendapatan, dan manajemen operasional harian bengkel." },
              { icon: <Shield size={26} strokeWidth={1.5} />, title: "Riwayat Servis", desc: "Pencatatan digital untuk seluruh log perbaikan dan pergantian suku cadang." },
              { icon: <Wrench size={26} strokeWidth={1.5} />, title: "Inventaris Part", desc: "Sistem auto-deduct untuk pengelolaan ketersediaan sparepart di gudang." },
            ].map((f, i) => (
               <div key={i} className="feature-card">
                 <div className="icon">{f.icon}</div>
                 <h3>{f.title}</h3>
                 <p>{f.desc}</p>
               </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2>Cara <span style={{ color: "var(--accent)" }}>Kerja</span></h2>
          <div className="steps">
            {[
              { num: "1", title: "Registrasi", desc: "Daftar akun dan lengkapi data profil serta kendaraan Anda." },
              { num: "2", title: "Pilih Layanan", desc: "Tentukan jenis servis dan ketersediaan jadwal bengkel." },
              { num: "3", title: "Pengerjaan", desc: "Kendaraan ditangani oleh mekanik profesional kami." },
              { num: "4", title: "Selesai", desc: "Terima notifikasi tagihan dan invoice digital yang rapi." },
            ].map((s, i) => (
              <div key={i} className="step">
                <div className="step-number">{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="landing-logo">
              <Wrench size={20} color="var(--accent)" strokeWidth={2.5} />
              FixIt
            </div>
            <p>© 2026 FixIt Platform. Tugas Kelompok Web Lanjutan.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
