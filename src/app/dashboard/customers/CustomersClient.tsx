"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCustomer, updateCustomer, deleteCustomer } from "@/actions/admin";
import { UserCircle, Search, Edit, Trash2, Plus, X, CalendarCheck } from "lucide-react";
import { useNotification } from "@/components/NotificationContext";

export default function CustomersClient({ customers }: { customers: any[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [modalMode, setModalMode] = useState<"ADD" | "EDIT" | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const { showToast, showConfirm } = useNotification();

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  function openAddModal() {
    setFormData({ name: "", email: "", phone: "" });
    setModalMode("ADD");
  }

  function openEditModal(c: any) {
    setEditingId(c.id);
    setFormData({ name: c.name, email: c.email, phone: c.phone || "" });
    setModalMode("EDIT");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (modalMode === "ADD") {
        await createCustomer(formData);
        showToast("Pelanggan berhasil ditambahkan", "success");
      } else if (modalMode === "EDIT" && editingId) {
        await updateCustomer(editingId, formData);
        showToast("Pelanggan berhasil diperbarui", "success");
      }
      setModalMode(null);
      router.refresh();
    } catch (err: any) {
      showToast(err.message || "Gagal menyimpan data", "error");
    }
  }

  async function handleDelete(id: number, name: string) {
    showConfirm(
      "Hapus Pelanggan?",
      `Yakin ingin menghapus ${name}? Semua data kendaraan dan riwayat pesanannya juga akan terhapus secara permanen.`,
      async () => {
        try {
          await deleteCustomer(id);
          showToast("Pelanggan berhasil dihapus", "success");
          router.refresh();
        } catch (err) {
          showToast("Gagal menghapus pelanggan", "error");
        }
      }
    );
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1><UserCircle size={24} style={{ display: "inline", marginRight: "8px" }} />Pelanggan</h1>
          <p>{customers.length} pelanggan terdaftar</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={16} /> Tambah Pelanggan
        </button>
      </div>

      <div className="mb-4" style={{ position: "relative", maxWidth: "400px" }}>
        <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
        <input
          className="form-input"
          placeholder="Cari nama atau email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ paddingLeft: "36px" }}
        />
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Email</th>
              <th>Telepon</th>
              <th>Kendaraan</th>
              <th>Total Booking</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id}>
                <td><strong>{c.name}</strong></td>
                <td>{c.email}</td>
                <td>{c.phone || "-"}</td>
                <td>{c.vehicles?.map((v: any) => `${v.brand} ${v.model} (${v.licensePlate})`).join(", ") || "-"}</td>
                <td>
                  <span className="badge badge-confirmed">
                    <CalendarCheck size={12} /> {c._count?.bookings || 0}
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn btn-secondary btn-sm" onClick={() => openEditModal(c)}>
                      <Edit size={14} /> Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id, c.name)}>
                      <Trash2 size={14} /> Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalMode && (
        <div className="modal-overlay" onClick={() => setModalMode(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalMode(null)}><X size={18} /></button>
            <h2>{modalMode === "ADD" ? "Tambah Pelanggan Baru" : "Edit Pelanggan"}</h2>
            {modalMode === "ADD" && (
              <div className="alert-bar alert-info mb-4">
                Password otomatis diatur ke: <strong>password123</strong>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nama Lengkap</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Nomor Telepon (Opsional)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="flex gap-2 mt-4">
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {modalMode === "ADD" ? "Simpan" : "Perbarui"}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setModalMode(null)}>
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
