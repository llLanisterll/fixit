"use client";
import { useState } from "react";
import { updateProfile } from "@/actions/profile";
import { useToast } from "@/components/Toast";
import { Edit } from "lucide-react";

export default function EditProfileForm({ user }: { user: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || "");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await updateProfile({ name, phone, password: password || undefined });
    if (res.error) {
      showToast(res.error, "error");
    } else {
      showToast("Profil berhasil diperbarui", "success");
      setIsEditing(false);
      setPassword("");
    }
    setLoading(false);
  }

  if (!isEditing) {
    return (
      <button className="btn btn-secondary w-full" onClick={() => setIsEditing(true)}>
        <Edit size={16} /> Edit Profil
      </button>
    );
  }

  return (
    <div style={{ background: "var(--bg-glass)", padding: "16px", borderRadius: "var(--radius-sm)", marginTop: "16px" }}>
      <h3 style={{ marginBottom: "12px", fontSize: "16px" }}>Edit Profil</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Nama Lengkap</label>
          <input className="form-input" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">No. Telepon</label>
          <input className="form-input" value={phone} onChange={e => setPhone(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Password Baru (Opsional)</label>
          <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Kosongkan jika tidak ingin mengubah" />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? <span className="spinner" /> : "Simpan"}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
