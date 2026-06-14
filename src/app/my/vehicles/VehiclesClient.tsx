"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createVehicle, updateVehicle, deleteVehicle } from "@/actions/vehicles";
import { Car, Plus, Edit, Trash2, X } from "lucide-react";

export default function VehiclesClient({ vehicles, userId }: { vehicles: any[]; userId: number }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = { brand: fd.get("brand") as string, model: fd.get("model") as string, year: Number(fd.get("year")), licensePlate: fd.get("licensePlate") as string, color: fd.get("color") as string };
    if (editing) { await updateVehicle(editing.id, data); setEditing(null); }
    else { await createVehicle({ ...data, userId }); }
    router.refresh();
    setShowForm(false);
  }

  return (
    <>
      <div className="page-header">
        <div><h1><Car size={24} style={{ display: "inline", marginRight: "8px" }} />Kendaraan Saya</h1><p>{vehicles.length} kendaraan terdaftar</p></div>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setShowForm(true); }}><Plus size={16} /> Tambah Kendaraan</button>
      </div>
      {vehicles.length === 0 ? (
        <div className="card"><div className="empty-state"><div className="icon">🚗</div><h3>Belum ada kendaraan</h3><p>Tambahkan kendaraan untuk mulai booking servis</p></div></div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
          {vehicles.map(v => (
            <div key={v.id} className="card">
              <div className="flex items-center gap-3 mb-4">
                <div style={{ width: "48px", height: "48px", borderRadius: "var(--radius-sm)", background: "rgba(59,130,246,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}><Car size={24} color="#3b82f6" /></div>
                <div><h3 style={{ fontSize: "16px", fontWeight: 700 }}>{v.brand} {v.model}</h3><p style={{ fontSize: "13px", color: "var(--text-muted)" }}>{v.year} • {v.color || "-"}</p></div>
              </div>
              <div style={{ padding: "10px 14px", background: "var(--bg-glass)", borderRadius: "var(--radius-sm)", marginBottom: "12px", fontFamily: "monospace", fontSize: "15px", fontWeight: 600, textAlign: "center" }}>{v.licensePlate}</div>
              <div className="flex gap-2">
                <button className="btn btn-secondary btn-sm" onClick={() => { setEditing(v); setShowForm(true); }}><Edit size={14} /> Edit</button>
                <button className="btn btn-danger btn-sm" onClick={async () => { if (confirm("Hapus kendaraan ini?")) { await deleteVehicle(v.id); router.refresh(); } }}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowForm(false)} aria-label="Close modal"><X size={18} /></button>
            <h2>{editing ? "Edit Kendaraan" : "Tambah Kendaraan"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                <div className="form-group"><label className="form-label">Merk</label><input name="brand" className="form-input" defaultValue={editing?.brand} placeholder="Toyota, Honda, dll" required /></div>
                <div className="form-group"><label className="form-label">Model/Tipe</label><input name="model" className="form-input" defaultValue={editing?.model} placeholder="Avanza, Beat, dll" required /></div>
              </div>
              <div className="grid-2">
                <div className="form-group"><label className="form-label">Tahun</label><input name="year" type="number" className="form-input" defaultValue={editing?.year || 2024} required /></div>
                <div className="form-group"><label className="form-label">Warna</label><input name="color" className="form-input" defaultValue={editing?.color} placeholder="Putih, Hitam, dll" /></div>
              </div>
              <div className="form-group"><label className="form-label">Plat Nomor</label><input name="licensePlate" className="form-input" defaultValue={editing?.licensePlate} placeholder="DD 1234 AB" required /></div>
              <div className="flex gap-2"><button type="submit" className="btn btn-primary">Simpan</button><button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Batal</button></div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
