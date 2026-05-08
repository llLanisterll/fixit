"use client";
import { useState } from "react";
import { updateBookingStatus } from "@/actions/bookings";
import { generateInvoice, createServiceLog } from "@/actions/admin";
import { CalendarCheck, Search, Eye, Check, Play, XCircle, FileText, Plus } from "lucide-react";
import { useToast } from "@/components/Toast";

export default function BookingsClient({ bookings, mechanics, spareparts }: { bookings: any[]; mechanics: any[]; spareparts: any[] }) {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState<any>(null);
  const { showToast } = useToast();
  
  const [logDesc, setLogDesc] = useState("");
  const [logPart, setLogPart] = useState("");
  const [logQty, setLogQty] = useState(1);
  const [logStatus, setLogStatus] = useState("IN_PROGRESS");
  const [loadingLog, setLoadingLog] = useState(false);

  async function handleAddLog(e: React.FormEvent) {
    e.preventDefault();
    if (!detail?.mechanicId) {
      showToast("Mekanik belum ditugaskan!", "error");
      return;
    }
    setLoadingLog(true);
    try {
      await createServiceLog({
        bookingId: detail.id,
        mechanicId: detail.mechanicId,
        sparepartId: logPart ? Number(logPart) : undefined,
        description: logDesc,
        sparepartQty: logPart ? logQty : 0,
        status: logStatus
      });
      showToast("Log berhasil ditambahkan", "success");
      setLogDesc("");
      setLogPart("");
      setLogQty(1);
      // Detail doesn't auto-update without refresh, we can close it or just let the user see it next time,
      // but ideally we'd want to fetch updated data. For simplicity, we just notify success.
    } catch (err) {
      showToast("Gagal menambahkan log", "error");
    }
    setLoadingLog(false);
  }

  const filtered = bookings.filter(b => {
    if (filter !== "ALL" && b.status !== filter) return false;
    if (search && !b.bookingCode.toLowerCase().includes(search.toLowerCase()) && !b.user.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statusActions: Record<string, { next: string; label: string; icon: any }[]> = {
    PENDING: [{ next: "CONFIRMED", label: "Konfirmasi", icon: <Check size={14} /> }, { next: "CANCELLED", label: "Tolak", icon: <XCircle size={14} /> }],
    CONFIRMED: [{ next: "IN_PROGRESS", label: "Mulai Kerjakan", icon: <Play size={14} /> }],
    IN_PROGRESS: [{ next: "COMPLETED", label: "Selesai", icon: <Check size={14} /> }],
  };

  return (
    <>
      <div className="page-header">
        <div><h1><CalendarCheck size={24} style={{ display: "inline", marginRight: "8px" }} />Kelola Booking</h1><p>{bookings.length} total booking</p></div>
      </div>
      <div className="flex gap-3 mb-4" style={{ flexWrap: "wrap" }}>
        {["ALL", "PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map(s => (
          <button key={s} className={`btn btn-sm ${filter === s ? "btn-primary" : "btn-secondary"}`} onClick={() => setFilter(s)}>
            {s === "ALL" ? "Semua" : s.replace("_", " ")} {s !== "ALL" && `(${bookings.filter(b => b.status === s).length})`}
          </button>
        ))}
      </div>
      <div className="mb-4" style={{ position: "relative", maxWidth: "400px" }}>
        <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
        <input className="form-input" placeholder="Cari kode booking atau nama..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: "36px" }} />
      </div>
      <div className="table-wrapper">
        <table className="table">
          <thead><tr><th>Kode</th><th>Pelanggan</th><th>Kendaraan</th><th>Tanggal</th><th>Mekanik</th><th>Status</th><th>Aksi</th></tr></thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b.id}>
                <td style={{ fontWeight: 600, color: "var(--accent)" }}>{b.bookingCode}</td>
                <td>{b.user.name}</td>
                <td>{b.vehicle.brand} {b.vehicle.model}<br /><span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{b.vehicle.licensePlate}</span></td>
                <td>{new Date(b.bookingDate).toLocaleDateString("id-ID")}<br /><span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{b.timeSlot}</span></td>
                <td>{b.mechanic?.name || <span style={{ color: "var(--text-muted)" }}>Belum ditugaskan</span>}</td>
                <td><span className={`badge badge-${b.status === "PENDING" ? "pending" : b.status === "CONFIRMED" ? "confirmed" : b.status === "IN_PROGRESS" ? "progress" : b.status === "COMPLETED" ? "completed" : "cancelled"}`}>{b.status}</span></td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn btn-secondary btn-sm" onClick={() => setDetail(b)}><Eye size={14} /></button>
                    {statusActions[b.status]?.map(action => (
                      <button key={action.next} className={`btn btn-sm ${action.next === "CANCELLED" ? "btn-danger" : "btn-primary"}`}
                        onClick={async () => {
                          let mechId = b.mechanicId;
                          if (action.next === "CONFIRMED" && !mechId && mechanics.length > 0) mechId = mechanics[0].id;
                          await updateBookingStatus(b.id, action.next, mechId || undefined);
                        }}>
                        {action.icon} {action.label}
                      </button>
                    ))}
                    {b.status === "COMPLETED" && !b.invoice && (
                      <button className="btn btn-success btn-sm" onClick={() => generateInvoice(b.id)}><FileText size={14} /> Invoice</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {detail && (
        <div className="modal-overlay" onClick={() => setDetail(null)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <h2>Detail Booking: {detail.bookingCode}</h2>
            <div className="detail-grid mb-6">
              <div className="detail-item"><div className="label">Pelanggan</div><div className="value">{detail.user.name}</div></div>
              <div className="detail-item"><div className="label">Kendaraan</div><div className="value">{detail.vehicle.brand} {detail.vehicle.model} ({detail.vehicle.licensePlate})</div></div>
              <div className="detail-item"><div className="label">Tanggal</div><div className="value">{new Date(detail.bookingDate).toLocaleDateString("id-ID")} - {detail.timeSlot}</div></div>
              <div className="detail-item"><div className="label">Mekanik</div><div className="value">{detail.mechanic?.name || "Belum ditugaskan"}</div></div>
              <div className="detail-item"><div className="label">Status</div><div className="value"><span className={`badge badge-${detail.status === "PENDING" ? "pending" : detail.status === "CONFIRMED" ? "confirmed" : detail.status === "IN_PROGRESS" ? "progress" : detail.status === "COMPLETED" ? "completed" : "cancelled"}`}>{detail.status}</span></div></div>
              {detail.notes && <div className="detail-item"><div className="label">Catatan</div><div className="value">{detail.notes}</div></div>}
            </div>
            <h3 style={{ marginBottom: "12px", fontSize: "15px" }}>Layanan Dipilih</h3>
            <div className="table-wrapper mb-4">
              <table className="table">
                <thead><tr><th>Layanan</th><th>Harga</th></tr></thead>
                <tbody>
                  {detail.bookingServices?.map((bs: any) => (
                    <tr key={bs.id}><td>{bs.service.name}</td><td>Rp {bs.priceAtBooking.toLocaleString("id-ID")}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>

            {detail.serviceLogs && detail.serviceLogs.length > 0 && (
              <>
                <h3 style={{ marginBottom: "12px", fontSize: "15px" }}>Riwayat Pengerjaan</h3>
                <div className="table-wrapper mb-4">
                  <table className="table">
                    <thead><tr><th>Waktu</th><th>Deskripsi</th><th>Part</th><th>Status</th></tr></thead>
                    <tbody>
                      {detail.serviceLogs.map((log: any) => (
                        <tr key={log.id}>
                          <td style={{fontSize: "12px"}}>{new Date(log.logDate).toLocaleString("id-ID")}</td>
                          <td>{log.description}</td>
                          <td>{log.sparepart ? `${log.sparepart.name} (x${log.sparepartQty})` : "-"}</td>
                          <td><span className={`badge badge-${log.status === "DONE" ? "completed" : "progress"}`}>{log.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {detail.status === "IN_PROGRESS" && (
              <div style={{ background: "var(--bg-glass)", padding: "16px", borderRadius: "var(--radius-sm)", marginBottom: "20px" }}>
                <h4 style={{ marginBottom: "12px", fontSize: "14px" }}>Tambah Log Pengerjaan</h4>
                <form onSubmit={handleAddLog}>
                  <div className="form-group">
                    <label className="form-label">Deskripsi</label>
                    <input className="form-input" value={logDesc} onChange={e => setLogDesc(e.target.value)} required placeholder="Misal: Ganti oli mesin" />
                  </div>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Sparepart (Opsional)</label>
                      <select className="form-input" value={logPart} onChange={e => setLogPart(e.target.value)}>
                        <option value="">Tidak ada part</option>
                        {spareparts.map(p => <option key={p.id} value={p.id} disabled={p.stock <= 0}>{p.name} (Stok: {p.stock})</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Jumlah</label>
                      <input type="number" className="form-input" value={logQty} onChange={e => setLogQty(Number(e.target.value))} min={1} disabled={!logPart} />
                    </div>
                  </div>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Status</label>
                      <select className="form-input" value={logStatus} onChange={e => setLogStatus(e.target.value)}>
                        <option value="IN_PROGRESS">Proses</option>
                        <option value="DONE">Selesai</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ display: "flex", alignItems: "flex-end" }}>
                      <button type="submit" className="btn btn-primary w-full" disabled={loadingLog}>
                        {loadingLog ? <span className="spinner" /> : <><Plus size={16} /> Tambah Log</>}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            <button className="btn btn-secondary" onClick={() => setDetail(null)}>Tutup</button>
          </div>
        </div>
      )}
    </>
  );
}
