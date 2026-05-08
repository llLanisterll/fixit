"use client";
import { useState } from "react";
import Link from "next/link";
import { Wrench, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/callback/credentials", {
      method: "POST",
      body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
      headers: { "Content-Type": "application/json" },
    });
    // Use signIn from next-auth/react instead
    const { signIn } = await import("next-auth/react");
    const result = await signIn("credentials", {
      email: form.get("email") as string,
      password: form.get("password") as string,
      redirect: false,
    });
    if (result?.error) {
      setError("Email atau password salah");
      setLoading(false);
    } else {
      // Check role to redirect
      const session = await fetch("/api/auth/session").then(r => r.json());
      if (session?.user?.role === "ADMIN") {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/my/dashboard";
      }
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ textAlign: "center", marginBottom: "8px" }}>
          <Link href="/" className="landing-logo" style={{ justifyContent: "center", marginBottom: "16px" }}>
            <Wrench size={28} color="var(--accent)" strokeWidth={2.5} />
            FixIt
          </Link>
        </div>
        <h1>Selamat Datang</h1>
        <p className="subtitle">Masuk ke akun Anda untuk melanjutkan</p>
        <div className="card">
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label"><Mail size={14} style={{ display: "inline", marginRight: "6px" }} />Email</label>
              <input name="email" type="email" className="form-input" placeholder="email@contoh.com" required />
            </div>
            <div className="form-group">
              <label className="form-label"><Lock size={14} style={{ display: "inline", marginRight: "6px" }} />Password</label>
              <input name="password" type="password" className="form-input" placeholder="••••••••" required />
            </div>
            <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading} style={{ justifyContent: "center" }}>
              {loading ? <span className="spinner" /> : "Masuk"}
            </button>
          </form>
        </div>
        <div className="auth-footer">
          Belum punya akun? <Link href="/register">Daftar sekarang</Link>
        </div>
        <div style={{ marginTop: "24px", padding: "16px", border: "1px solid var(--border)", background: "var(--bg-secondary)", fontSize: "12px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          <strong style={{ color: "var(--accent)" }}>[ DEMO ACCESS ]</strong><br /><br />
          ADMIN: admin@fixit.com / admin123<br />
          CUSTOMER: ahmad@email.com / user123
        </div>
      </div>
    </div>
  );
}
