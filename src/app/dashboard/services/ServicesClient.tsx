"use client";
import { useState } from "react";
import { createService, updateService, deleteService } from "@/actions/admin";
import { Settings, Plus, Edit, Trash2 } from "lucide-react";

export default function ServicesClient({ services }: { services: any[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = { name: fd.get("name") as string, description: fd.get("description") as string, category: fd.get("category") as string, price: Number(fd.get("price")), estimatedMinutes: Number(fd.get("estimatedMinutes")), isActive: true };
    if (editing) { await updateService(editing.id, { ...data, isActive: editing.isActive }); setEditing(null); }
    else { await createService(data); }
    setShowForm(false);
  }

  return (
    <>
      <div className="page-header">
        <div><h1><Settings size={24} style={{ display: "inline", marginRight: "8px" }} />Kelola Layanan</h1><p>{services.length} layanan tersedia</p></div>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setShowForm(true); }}><Plus size={16} /> Tambah Layanan</button>
      </div>
      <div className="table-wrapper">
        <table className="table">
          <thead><tr><th>Nama Layanan</th><th>Kategori</th><th>Harga</th><th>Estimasi</th><th>Status</th><th>Aksi</th></tr></thead>
          <tbody>
            {services.map(s => (
              <tr key={s.id}>
                <td><strong>{s.name}</strong><br /><span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{s.description}</span></td>
                <td><span className={`badge badge-${s.category.toLowerCase()}`}>{s.category}</span></td>
                <td>Rp {s.price.toLocaleString("id-ID")}</td>
                <td>{s.estimatedMinutes} menit</td>
                <td><span className={`badge ${s.isActive ? "badge-available" : "badge-off"}`}>{s.isActive ? "Aktif" : "Nonaktif"}</span></td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn btn-secondary btn-sm" onClick={() => { setEditing(s); setShowForm(true); }}><Edit size={14} /></button>
                    <button className="btn btn-danger btn-sm" onClick={() => { if (confirm("Hapus layanan ini?")) deleteService(s.id); }}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editing ? "Edit Layanan" : "Tambah Layanan"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label className="form-label">Nama</label><input name="name" className="form-input" defaultValue={editing?.name} required /></div>
              <div className="form-group"><label className="form-label">Deskripsi</label><textarea name="description" className="form-input" defaultValue={editing?.description} /></div>
              <div className="grid-2">
                <div className="form-group"><label className="form-label">Kategori</label><select name="category" className="form-input" defaultValue={editing?.category || "ROUTINE"}><option value="ROUTINE">Routine</option><option value="HEAVY">Heavy</option></select></div>
                <div className="form-group"><label className="form-label">Estimasi (menit)</label><input name="estimatedMinutes" type="number" className="form-input" defaultValue={editing?.estimatedMinutes || 60} required /></div>
              </div>
              <div className="form-group"><label className="form-label">Harga (Rp)</label><input name="price" type="number" className="form-input" defaultValue={editing?.price} required /></div>
              <div className="flex gap-2"><button type="submit" className="btn btn-primary">Simpan</button><button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Batal</button></div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
