"use client";
import { useState } from "react";
import Link from "next/link";
import { Wrench, User, Mail, Lock, Phone, ArrowLeft } from "lucide-react";
import { registerAction } from "@/actions/auth";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    if (form.get("password") !== form.get("confirmPassword")) {
      setError("Password tidak cocok");
      setLoading(false);
      return;
    }
    const result = await registerAction(form);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      {/* Tombol Kembali yang lebih rapi */}
      <div style={{ position: "absolute", top: "32px", left: "32px", zIndex: 10 }}>
        <Link href="/" className="lp-btn lp-btn--ghost" style={{ padding: "8px 16px", borderRadius: "8px", fontSize: "13px" }}>
          <ArrowLeft size={16} /> Kembali ke Beranda
        </Link>
      </div>

      <div className="auth-card">
        <div style={{ textAlign: "center", marginBottom: "8px" }}>
          <Link href="/" className="landing-logo" style={{ justifyContent: "center", marginBottom: "16px" }}>
            <Wrench size={28} color="var(--accent)" strokeWidth={2.5} />
            FixIt
          </Link>
        </div>
        <h1>Buat Akun Baru</h1>
        <p className="subtitle">Daftar untuk mulai booking servis kendaraan</p>
        <div className="card">
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label"><User size={14} style={{ display: "inline", marginRight: "6px" }} />Nama Lengkap</label>
              <input name="name" type="text" className="form-input" placeholder="Nama lengkap" required />
            </div>
            <div className="form-group">
              <label className="form-label"><Mail size={14} style={{ display: "inline", marginRight: "6px" }} />Email</label>
              <input name="email" type="email" className="form-input" placeholder="email@contoh.com" required />
            </div>
            <div className="form-group">
              <label className="form-label"><Phone size={14} style={{ display: "inline", marginRight: "6px" }} />No. Telepon</label>
              <input name="phone" type="tel" className="form-input" placeholder="08xxxxxxxxxx" />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label"><Lock size={14} style={{ display: "inline", marginRight: "6px" }} />Password</label>
                <input name="password" type="password" className="form-input" placeholder="Min. 6 karakter" required minLength={6} />
              </div>
              <div className="form-group">
                <label className="form-label">Konfirmasi Password</label>
                <input name="confirmPassword" type="password" className="form-input" placeholder="Ulangi password" required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading} style={{ justifyContent: "center" }}>
              {loading ? <span className="spinner" /> : "Daftar Sekarang"}
            </button>
          </form>
        </div>
        <div className="auth-footer">Sudah punya akun? <Link href="/login">Masuk</Link></div>
      </div>
    </div>
  );
}
