"use client";
import { useState } from "react";
import { createSparepart, updateSparepart, deleteSparepart } from "@/actions/admin";
import { Package, Plus, Edit, Trash2, AlertTriangle } from "lucide-react";

export default function SparepartsClient({ spareparts }: { spareparts: any[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const lowStock = spareparts.filter(s => s.stock <= s.minStock);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = { name: fd.get("name") as string, partNumber: fd.get("partNumber") as string, brand: fd.get("brand") as string, stock: Number(fd.get("stock")), price: Number(fd.get("price")), unit: fd.get("unit") as string || "pcs", minStock: Number(fd.get("minStock")) };
    if (editing) { await updateSparepart(editing.id, data); setEditing(null); }
    else { await createSparepart(data); }
    setShowForm(false);
  }

  return (
    <>
      <div className="page-header">
        <div><h1><Package size={24} style={{ display: "inline", marginRight: "8px" }} />Inventaris Sparepart</h1><p>{spareparts.length} jenis suku cadang</p></div>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setShowForm(true); }}><Plus size={16} /> Tambah Sparepart</button>
      </div>
      {lowStock.length > 0 && <div className="alert-bar alert-warning"><AlertTriangle size={16} /> {lowStock.length} item stok menipis: {lowStock.map(s => s.name).join(", ")}</div>}
      <div className="table-wrapper">
        <table className="table">
          <thead><tr><th>Nama</th><th>Part Number</th><th>Brand</th><th>Stok</th><th>Harga</th><th>Aksi</th></tr></thead>
          <tbody>
            {spareparts.map(s => (
              <tr key={s.id}>
                <td><strong>{s.name}</strong></td>
                <td style={{ fontFamily: "monospace", fontSize: "13px" }}>{s.partNumber}</td>
                <td>{s.brand || "-"}</td>
                <td><span style={{ color: s.stock <= s.minStock ? "var(--red)" : "var(--green)", fontWeight: 700 }}>{s.stock}</span> <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>/ min {s.minStock} {s.unit}</span></td>
                <td>Rp {s.price.toLocaleString("id-ID")}</td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn btn-secondary btn-sm" onClick={() => { setEditing(s); setShowForm(true); }}><Edit size={14} /></button>
                    <button className="btn btn-danger btn-sm" onClick={() => { if (confirm("Hapus?")) deleteSparepart(s.id); }}><Trash2 size={14} /></button>
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
            <h2>{editing ? "Edit Sparepart" : "Tambah Sparepart"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label className="form-label">Nama</label><input name="name" className="form-input" defaultValue={editing?.name} required /></div>
              <div className="grid-2">
                <div className="form-group"><label className="form-label">Part Number</label><input name="partNumber" className="form-input" defaultValue={editing?.partNumber} required /></div>
                <div className="form-group"><label className="form-label">Brand</label><input name="brand" className="form-input" defaultValue={editing?.brand} /></div>
              </div>
              <div className="grid-2">
                <div className="form-group"><label className="form-label">Stok</label><input name="stock" type="number" className="form-input" defaultValue={editing?.stock || 0} required /></div>
                <div className="form-group"><label className="form-label">Harga (Rp)</label><input name="price" type="number" className="form-input" defaultValue={editing?.price} required /></div>
              </div>
              <div className="grid-2">
                <div className="form-group"><label className="form-label">Satuan</label><input name="unit" className="form-input" defaultValue={editing?.unit || "pcs"} /></div>
                <div className="form-group"><label className="form-label">Stok Minimum</label><input name="minStock" type="number" className="form-input" defaultValue={editing?.minStock || 5} /></div>
              </div>
              <div className="flex gap-2"><button type="submit" className="btn btn-primary">Simpan</button><button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Batal</button></div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
