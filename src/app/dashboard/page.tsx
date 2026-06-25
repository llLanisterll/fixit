export const dynamic = "force-dynamic";
import prisma from "@/lib/prisma";
import { CalendarCheck, Users, Package, DollarSign, AlertTriangle, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";
import { DashboardCharts } from "./DashboardCharts";

export default async function AdminDashboard() {
  const [totalBookings, pendingBookings, inProgressBookings, completedBookings, totalMechanics, availableMechanics, totalSpareparts, lowStockParts, totalRevenue, unpaidInvoices, recentBookings] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.booking.count({ where: { status: "IN_PROGRESS" } }),
    prisma.booking.count({ where: { status: "COMPLETED" } }),
    prisma.mechanic.count(),
    prisma.mechanic.count({ where: { status: "AVAILABLE" } }),
    prisma.sparepart.count(),
    prisma.sparepart.findMany({ where: { stock: { lte: prisma.sparepart.fields?.minStock || 5 } } }).catch(() => []),
    prisma.invoice.aggregate({ _sum: { grandTotal: true }, where: { paymentStatus: "PAID" } }),
    prisma.invoice.count({ where: { paymentStatus: "UNPAID" } }),
    prisma.booking.findMany({ take: 5, orderBy: { createdAt: "desc" }, include: { user: true, vehicle: true, mechanic: true } }),
  ]);

  const allParts = await prisma.sparepart.findMany();
  const lowStock = allParts.filter(p => p.stock <= p.minStock);

  const revenue = totalRevenue._sum.grandTotal || 0;

  // Generate stats for charts (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const recentAllBookings = await prisma.booking.findMany({
    where: { createdAt: { gte: sevenDaysAgo } },
    select: { createdAt: true }
  });

  const recentInvoices = await prisma.invoice.findMany({
    where: { paymentStatus: "PAID", paidAt: { gte: sevenDaysAgo } },
    select: { paidAt: true, grandTotal: true }
  });

  const bookingStats = [];
  const revenueStats = [];
  
  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo);
    d.setDate(d.getDate() + i);
    const dateStr = d.toLocaleDateString("id-ID", { weekday: 'short' });
    
    bookingStats.push({
      date: dateStr,
      count: recentAllBookings.filter(b => new Date(b.createdAt).getDate() === d.getDate()).length
    });
    
    const dayRevenue = recentInvoices
      .filter(inv => inv.paidAt && new Date(inv.paidAt).getDate() === d.getDate())
      .reduce((sum, inv) => sum + inv.grandTotal, 0);
      
    revenueStats.push({
      date: dateStr,
      revenue: dayRevenue
    });
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Dashboard Admin</h1>
          <p>Selamat datang di panel administrasi FixIt</p>
        </div>
      </div>

      {lowStock.length > 0 && (
        <div className="alert-bar alert-warning">
          <AlertTriangle size={16} /> {lowStock.length} suku cadang stok menipis! <Link href="/dashboard/spareparts" style={{ marginLeft: "auto", fontWeight: 600, textDecoration: "underline" }}>Lihat Detail</Link>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(59,130,246,0.12)", color: "#3b82f6" }}><CalendarCheck size={24} /></div>
          <div className="stat-value">{totalBookings}</div>
          <div className="stat-label">Total Booking</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b" }}><Clock size={24} /></div>
          <div className="stat-value">{pendingBookings}</div>
          <div className="stat-label">Menunggu Konfirmasi</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(139,92,246,0.12)", color: "#8b5cf6" }}><TrendingUp size={24} /></div>
          <div className="stat-value">{inProgressBookings}</div>
          <div className="stat-label">Sedang Dikerjakan</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}><DollarSign size={24} /></div>
          <div className="stat-value">Rp {(revenue / 1000000).toFixed(1)}jt</div>
          <div className="stat-label">Total Pendapatan</div>
        </div>
      </div>

      <DashboardCharts bookingStats={bookingStats} revenueStats={revenueStats} />

      <div className="grid-2" style={{ alignItems: "start" }}>
        <div className="card">
          <h3 style={{ marginBottom: "16px", fontSize: "16px", fontWeight: "700" }}>Booking Terbaru</h3>
          <div className="table-wrapper">
            <table className="table">
              <thead><tr><th>Kode</th><th>Pelanggan</th><th>Kendaraan</th><th>Status</th></tr></thead>
              <tbody>
                {recentBookings.map((b: any) => (
                  <tr key={b.id}>
                    <td><Link href={`/dashboard/bookings`} style={{ color: "var(--accent)", fontWeight: 600 }}>{b.bookingCode}</Link></td>
                    <td>{b.user.name}</td>
                    <td>{b.vehicle.brand} {b.vehicle.model}</td>
                    <td><span className={`badge badge-${b.status === "PENDING" ? "pending" : b.status === "CONFIRMED" ? "confirmed" : b.status === "IN_PROGRESS" ? "progress" : b.status === "COMPLETED" ? "completed" : "cancelled"}`}>{b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: "16px", fontSize: "16px", fontWeight: "700" }}>Ringkasan</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div className="flex items-center justify-between" style={{ padding: "12px", background: "var(--bg-glass)", borderRadius: "8px" }}>
              <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}><Users size={16} style={{ display: "inline", marginRight: "8px" }} />Mekanik Tersedia</span>
              <strong>{availableMechanics}/{totalMechanics}</strong>
            </div>
            <div className="flex items-center justify-between" style={{ padding: "12px", background: "var(--bg-glass)", borderRadius: "8px" }}>
              <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}><Package size={16} style={{ display: "inline", marginRight: "8px" }} />Jenis Sparepart</span>
              <strong>{totalSpareparts}</strong>
            </div>
            <div className="flex items-center justify-between" style={{ padding: "12px", background: "var(--bg-glass)", borderRadius: "8px" }}>
              <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}><AlertTriangle size={16} style={{ display: "inline", marginRight: "8px" }} />Stok Menipis</span>
              <strong style={{ color: lowStock.length > 0 ? "var(--red)" : "var(--green)" }}>{lowStock.length}</strong>
            </div>
            <div className="flex items-center justify-between" style={{ padding: "12px", background: "var(--bg-glass)", borderRadius: "8px" }}>
              <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}><DollarSign size={16} style={{ display: "inline", marginRight: "8px" }} />Invoice Belum Bayar</span>
              <strong style={{ color: unpaidInvoices > 0 ? "var(--amber)" : "var(--green)" }}>{unpaidInvoices}</strong>
            </div>
            <div className="flex items-center justify-between" style={{ padding: "12px", background: "var(--bg-glass)", borderRadius: "8px" }}>
              <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}><CalendarCheck size={16} style={{ display: "inline", marginRight: "8px" }} />Selesai</span>
              <strong style={{ color: "var(--green)" }}>{completedBookings}</strong>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
