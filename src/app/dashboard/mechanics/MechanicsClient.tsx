"use client";
import { useState } from "react";
import { createMechanic, updateMechanic, deleteMechanic } from "@/actions/admin";
import { Users, Plus, Edit, Trash2 } from "lucide-react";

export default function MechanicsClient({ mechanics }: { mechanics: any[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = { name: fd.get("name") as string, phone: fd.get("phone") as string, specialization: fd.get("specialization") as string, status: fd.get("status") as string || "AVAILABLE" };
    if (editing) { await updateMechanic(editing.id, data); setEditing(null); }
    else { await createMechanic(data); }
    setShowForm(false);
  }

  return (
    <>
      <div className="page-header">
        <div><h1><Users size={24} style={{ display: "inline", marginRight: "8px" }} />Kelola Mekanik</h1><p>{mechanics.length} mekanik terdaftar</p></div>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setShowForm(true); }}><Plus size={16} /> Tambah Mekanik</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
        {mechanics.map(m => (
          <div key={m.id} className="card" style={{ position: "relative" }}>
            <div className="flex items-center gap-3 mb-4">
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "linear-gradient(135deg, var(--accent), var(--purple))", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "18px" }}>{m.name[0]}</div>
              <div><h3 style={{ fontSize: "16px", fontWeight: 600 }}>{m.name}</h3><p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{m.specialization || "Umum"}</p></div>
              <span className={`badge badge-${m.status.toLowerCase()}`} style={{ marginLeft: "auto" }}>{m.status}</span>
            </div>
            <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "12px" }}>📞 {m.phone || "-"} • 📋 {m._count?.bookings || 0} booking</div>
            <div className="flex gap-2">
              <button className="btn btn-secondary btn-sm" onClick={() => { setEditing(m); setShowForm(true); }}><Edit size={14} /> Edit</button>
              <button className="btn btn-danger btn-sm" onClick={() => { if (confirm("Hapus mekanik ini?")) deleteMechanic(m.id); }}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editing ? "Edit Mekanik" : "Tambah Mekanik"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label className="form-label">Nama</label><input name="name" className="form-input" defaultValue={editing?.name} required /></div>
              <div className="form-group"><label className="form-label">No. Telepon</label><input name="phone" className="form-input" defaultValue={editing?.phone} /></div>
              <div className="form-group"><label className="form-label">Spesialisasi</label><input name="specialization" className="form-input" defaultValue={editing?.specialization} /></div>
              {editing && (
                <div className="form-group"><label className="form-label">Status</label>
                  <select name="status" className="form-input" defaultValue={editing?.status}><option value="AVAILABLE">Available</option><option value="BUSY">Busy</option><option value="OFF">Off</option></select>
                </div>
              )}
              <div className="flex gap-2"><button type="submit" className="btn btn-primary">Simpan</button><button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Batal</button></div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
