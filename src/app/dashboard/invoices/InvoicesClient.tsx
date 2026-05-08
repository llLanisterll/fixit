"use client";
import { useState } from "react";
import { markInvoicePaid } from "@/actions/admin";
import { FileText, Eye, CheckCircle } from "lucide-react";

export default function InvoicesClient({ invoices }: { invoices: any[] }) {
  const [detail, setDetail] = useState<any>(null);

  return (
    <>
      <div className="page-header"><div><h1><FileText size={24} style={{ display: "inline", marginRight: "8px" }} />Kelola Invoice</h1><p>{invoices.length} invoice</p></div></div>
      <div className="table-wrapper">
        <table className="table">
          <thead><tr><th>No. Invoice</th><th>Booking</th><th>Pelanggan</th><th>Grand Total</th><th>Status</th><th>Aksi</th></tr></thead>
          <tbody>
            {invoices.map(inv => (
              <tr key={inv.id}>
                <td style={{ fontWeight: 600 }}>{inv.invoiceNumber}</td>
                <td>{inv.booking.bookingCode}</td>
                <td>{inv.booking.user.name}</td>
                <td style={{ fontWeight: 700 }}>Rp {inv.grandTotal.toLocaleString("id-ID")}</td>
                <td><span className={`badge badge-${inv.paymentStatus.toLowerCase()}`}>{inv.paymentStatus}</span></td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn btn-secondary btn-sm" onClick={() => setDetail(inv)}><Eye size={14} /> Detail</button>
                    {inv.paymentStatus === "UNPAID" && (
                      <button className="btn btn-success btn-sm" onClick={() => markInvoicePaid(inv.id, "Transfer Bank")}><CheckCircle size={14} /> Bayar</button>
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
            <h2>Invoice: {detail.invoiceNumber}</h2>
            <div className="detail-grid mb-6">
              <div className="detail-item"><div className="label">Booking</div><div className="value">{detail.booking.bookingCode}</div></div>
              <div className="detail-item"><div className="label">Pelanggan</div><div className="value">{detail.booking.user.name}</div></div>
              <div className="detail-item"><div className="label">Kendaraan</div><div className="value">{detail.booking.vehicle.brand} {detail.booking.vehicle.model}</div></div>
              <div className="detail-item"><div className="label">Status</div><div className="value"><span className={`badge badge-${detail.paymentStatus.toLowerCase()}`}>{detail.paymentStatus}</span></div></div>
            </div>
            <div style={{ background: "var(--bg-glass)", padding: "20px", borderRadius: "var(--radius-sm)", marginBottom: "20px" }}>
              <div className="flex justify-between mb-4" style={{ padding: "8px 0", borderBottom: "1px solid var(--border)" }}><span style={{ color: "var(--text-secondary)" }}>Biaya Servis</span><span>Rp {detail.serviceCost.toLocaleString("id-ID")}</span></div>
              <div className="flex justify-between mb-4" style={{ padding: "8px 0", borderBottom: "1px solid var(--border)" }}><span style={{ color: "var(--text-secondary)" }}>Biaya Sparepart</span><span>Rp {detail.sparepartCost.toLocaleString("id-ID")}</span></div>
              <div className="flex justify-between mb-4" style={{ padding: "8px 0", borderBottom: "1px solid var(--border)" }}><span style={{ color: "var(--text-secondary)" }}>Subtotal</span><span>Rp {detail.totalCost.toLocaleString("id-ID")}</span></div>
              <div className="flex justify-between mb-4" style={{ padding: "8px 0", borderBottom: "1px solid var(--border)" }}><span style={{ color: "var(--text-secondary)" }}>PPN (10%)</span><span>Rp {detail.tax.toLocaleString("id-ID")}</span></div>
              <div className="flex justify-between" style={{ padding: "8px 0", fontSize: "18px", fontWeight: 800 }}><span>Grand Total</span><span style={{ color: "var(--accent)" }}>Rp {detail.grandTotal.toLocaleString("id-ID")}</span></div>
            </div>
            <button className="btn btn-secondary" onClick={() => setDetail(null)}>Tutup</button>
          </div>
        </div>
      )}
    </>
  );
}
