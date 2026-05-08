"use client";
import { useState } from "react";
import { cancelBooking } from "@/actions/bookings";
import { CalendarCheck, Eye, XCircle, Check } from "lucide-react";

const statusSteps = ["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED"];
const statusLabels: Record<string, string> = { PENDING: "Menunggu", CONFIRMED: "Dikonfirmasi", IN_PROGRESS: "Dikerjakan", COMPLETED: "Selesai", CANCELLED: "Dibatalkan" };

export default function BookingsListClient({ bookings }: { bookings: any[] }) {
  const [detail, setDetail] = useState<any>(null);
  const [filter, setFilter] = useState("ALL");
  const filtered = bookings.filter(b => filter === "ALL" || b.status === filter);

  return (
    <>
      <div className="page-header"><div><h1><CalendarCheck size={24} style={{ display: "inline", marginRight: "8px" }} />Riwayat Booking</h1><p>{bookings.length} booking</p></div></div>
      <div className="flex gap-2 mb-4" style={{ flexWrap: "wrap" }}>
        {["ALL", "PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map(s => (
          <button key={s} className={`btn btn-sm ${filter === s ? "btn-primary" : "btn-secondary"}`} onClick={() => setFilter(s)}>{s === "ALL" ? "Semua" : statusLabels[s]}</button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="card"><div className="empty-state"><h3>Tidak ada booking</h3></div></div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filtered.map(b => (
            <div key={b.id} className="card" style={{ cursor: "pointer" }} onClick={() => setDetail(b)}>
              <div className="flex items-center justify-between" style={{ flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <div style={{ fontWeight: 700, color: "var(--accent)", marginBottom: "4px" }}>{b.bookingCode}</div>
                  <div style={{ fontSize: "14px" }}>{b.vehicle.brand} {b.vehicle.model} ({b.vehicle.licensePlate})</div>
                  <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>{new Date(b.bookingDate).toLocaleDateString("id-ID")} • {b.timeSlot}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span className={`badge badge-${b.status === "PENDING" ? "pending" : b.status === "CONFIRMED" ? "confirmed" : b.status === "IN_PROGRESS" ? "progress" : b.status === "COMPLETED" ? "completed" : "cancelled"}`}>{statusLabels[b.status]}</span>
                  <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>{b.bookingServices.map((bs: any) => bs.service.name).join(", ")}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {detail && (
        <div className="modal-overlay" onClick={() => setDetail(null)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <h2>{detail.bookingCode}</h2>
            {/* Status Tracker */}
            {detail.status !== "CANCELLED" && (
              <div className="status-tracker">
                {statusSteps.map((s, i) => {
                  const currentIdx = statusSteps.indexOf(detail.status);
                  return (
                    <div key={s} style={{ display: "contents" }}>
                      <div className={`status-step ${i === currentIdx ? "active" : i < currentIdx ? "completed" : ""}`}>
                        <div className="dot">{i < currentIdx ? <Check size={14} /> : i + 1}</div>
                        <div className="label">{statusLabels[s]}</div>
                      </div>
                      {i < statusSteps.length - 1 && <div className={`status-line ${i < currentIdx ? "active" : ""}`} />}
                    </div>
                  );
                })}
              </div>
            )}
            <div className="detail-grid mb-6">
              <div className="detail-item"><div className="label">Kendaraan</div><div className="value">{detail.vehicle.brand} {detail.vehicle.model}</div></div>
              <div className="detail-item"><div className="label">Plat Nomor</div><div className="value">{detail.vehicle.licensePlate}</div></div>
              <div className="detail-item"><div className="label">Tanggal</div><div className="value">{new Date(detail.bookingDate).toLocaleDateString("id-ID")}</div></div>
              <div className="detail-item"><div className="label">Jam</div><div className="value">{detail.timeSlot}</div></div>
              <div className="detail-item"><div className="label">Mekanik</div><div className="value">{detail.mechanic?.name || "Belum ditugaskan"}</div></div>
              {detail.notes && <div className="detail-item"><div className="label">Catatan</div><div className="value">{detail.notes}</div></div>}
            </div>
            <h4 style={{ marginBottom: "8px", fontSize: "14px" }}>Layanan</h4>
            <div className="table-wrapper mb-4">
              <table className="table"><thead><tr><th>Layanan</th><th>Harga</th></tr></thead><tbody>
                {detail.bookingServices.map((bs: any) => (<tr key={bs.id}><td>{bs.service.name}</td><td>Rp {bs.priceAtBooking.toLocaleString("id-ID")}</td></tr>))}
                <tr><td style={{ fontWeight: 700 }}>Total</td><td style={{ fontWeight: 700, color: "var(--accent)" }}>Rp {detail.bookingServices.reduce((s: number, bs: any) => s + bs.priceAtBooking, 0).toLocaleString("id-ID")}</td></tr>
              </tbody></table>
            </div>
            {detail.serviceLogs.length > 0 && (<><h4 style={{ marginBottom: "8px", fontSize: "14px" }}>Log Pengerjaan</h4><div className="table-wrapper mb-4"><table className="table"><thead><tr><th>Waktu</th><th>Deskripsi</th><th>Part</th><th>Status</th></tr></thead><tbody>
              {detail.serviceLogs.map((sl: any) => (<tr key={sl.id}><td style={{ fontSize: "12px" }}>{new Date(sl.logDate).toLocaleString("id-ID")}</td><td>{sl.description}</td><td>{sl.sparepart ? `${sl.sparepart.name} (x${sl.sparepartQty})` : "-"}</td><td><span className={`badge badge-${sl.status === "DONE" ? "completed" : "progress"}`}>{sl.status}</span></td></tr>))}
            </tbody></table></div></>)}
            {detail.invoice && (
              <div style={{ background: "rgba(16,185,129,0.08)", padding: "16px", borderRadius: "var(--radius-sm)", marginBottom: "16px" }}>
                <div className="flex justify-between"><span>Invoice: {detail.invoice.invoiceNumber}</span><span className={`badge badge-${detail.invoice.paymentStatus.toLowerCase()}`}>{detail.invoice.paymentStatus}</span></div>
                <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--accent)", marginTop: "8px" }}>Rp {detail.invoice.grandTotal.toLocaleString("id-ID")}</div>
              </div>
            )}
            <div className="flex gap-2">
              {detail.status === "PENDING" && <button className="btn btn-danger" onClick={async () => { await cancelBooking(detail.id); setDetail(null); }}><XCircle size={16} /> Batalkan</button>}
              <button className="btn btn-secondary" onClick={() => setDetail(null)}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
