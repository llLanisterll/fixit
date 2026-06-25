export const dynamic = "force-dynamic";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CalendarCheck, Car, Clock, CheckCircle, Plus } from "lucide-react";

export default async function CustomerDashboard() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const userId = Number(session.user.id);
  const [vehicles, bookings, recentBookings] = await Promise.all([
    prisma.vehicle.count({ where: { userId } }),
    prisma.booking.count({ where: { userId } }),
    prisma.booking.findMany({ where: { userId }, take: 5, orderBy: { createdAt: "desc" }, include: { vehicle: true, mechanic: true, bookingServices: { include: { service: true } } } }),
  ]);
  const activeBookings = await prisma.booking.count({ where: { userId, status: { in: ["PENDING", "CONFIRMED", "IN_PROGRESS"] } } });
  const completedBookings = await prisma.booking.count({ where: { userId, status: "COMPLETED" } });

  return (
    <>
      <div className="page-header">
        <div><h1>Halo, {session.user.name}! 👋</h1><p>Selamat datang di dashboard FixIt</p></div>
        <Link href="/my/booking/new" className="btn btn-primary"><Plus size={16} /> Booking Baru</Link>
      </div>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-icon" style={{ background: "rgba(59,130,246,0.12)", color: "#3b82f6" }}><Car size={24} /></div><div className="stat-value">{vehicles}</div><div className="stat-label">Kendaraan</div></div>
        <div className="stat-card"><div className="stat-icon" style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b" }}><Clock size={24} /></div><div className="stat-value">{activeBookings}</div><div className="stat-label">Booking Aktif</div></div>
        <div className="stat-card"><div className="stat-icon" style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}><CheckCircle size={24} /></div><div className="stat-value">{completedBookings}</div><div className="stat-label">Selesai</div></div>
        <div className="stat-card"><div className="stat-icon" style={{ background: "rgba(139,92,246,0.12)", color: "#8b5cf6" }}><CalendarCheck size={24} /></div><div className="stat-value">{bookings}</div><div className="stat-label">Total Booking</div></div>
      </div>
      <div className="card">
        <h3 style={{ marginBottom: "16px", fontSize: "16px", fontWeight: 700 }}>Booking Terbaru</h3>
        {recentBookings.length === 0 ? (
          <div className="empty-state"><div className="icon">📋</div><h3>Belum ada booking</h3><p>Mulai booking servis kendaraan Anda sekarang</p><Link href="/my/booking/new" className="btn btn-primary mt-4"><Plus size={16} /> Booking Sekarang</Link></div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead><tr><th>Kode</th><th>Kendaraan</th><th>Tanggal</th><th>Layanan</th><th>Status</th></tr></thead>
              <tbody>
                {recentBookings.map((b: any) => (
                  <tr key={b.id}>
                    <td><Link href={`/my/bookings`} style={{ color: "var(--accent)", fontWeight: 600 }}>{b.bookingCode}</Link></td>
                    <td>{b.vehicle.brand} {b.vehicle.model}</td>
                    <td>{new Date(b.bookingDate).toLocaleDateString("id-ID")}</td>
                    <td>{b.bookingServices.map((bs: any) => bs.service.name).join(", ")}</td>
                    <td><span className={`badge badge-${b.status === "PENDING" ? "pending" : b.status === "CONFIRMED" ? "confirmed" : b.status === "IN_PROGRESS" ? "progress" : b.status === "COMPLETED" ? "completed" : "cancelled"}`}>{b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
