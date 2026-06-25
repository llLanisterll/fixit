export const dynamic = "force-dynamic";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserCircle, Mail, Phone, Calendar } from "lucide-react";
import EditProfileForm from "./EditProfileForm";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const user = await prisma.user.findUnique({ where: { id: Number(session.user.id) }, include: { _count: { select: { vehicles: true, bookings: true } } } });
  if (!user) redirect("/login");

  return (
    <>
      <div className="page-header"><div><h1><UserCircle size={24} style={{ display: "inline", marginRight: "8px" }} />Profil Saya</h1></div></div>
      <div className="card" style={{ maxWidth: "600px" }}>
        <div className="flex items-center gap-4 mb-6">
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "linear-gradient(135deg, var(--accent), var(--purple))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: 800 }}>{user.name[0]}</div>
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: 700 }}>{user.name}</h2>
            <span className="badge badge-confirmed">{user.role}</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="flex items-center gap-3" style={{ padding: "14px", background: "var(--bg-glass)", borderRadius: "var(--radius-sm)" }}>
            <Mail size={18} color="#3b82f6" /><div><div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Email</div><div style={{ fontWeight: 600 }}>{user.email}</div></div>
          </div>
          <div className="flex items-center gap-3" style={{ padding: "14px", background: "var(--bg-glass)", borderRadius: "var(--radius-sm)" }}>
            <Phone size={18} color="#10b981" /><div><div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Telepon</div><div style={{ fontWeight: 600 }}>{user.phone || "-"}</div></div>
          </div>
          <div className="flex items-center gap-3" style={{ padding: "14px", background: "var(--bg-glass)", borderRadius: "var(--radius-sm)" }}>
            <Calendar size={18} color="#f59e0b" /><div><div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Bergabung Sejak</div><div style={{ fontWeight: 600 }}>{new Date(user.createdAt).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}</div></div>
          </div>
        </div>
        <div className="grid-2 mt-4">
          <div style={{ padding: "16px", background: "rgba(59,130,246,0.08)", borderRadius: "var(--radius-sm)", textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: 800 }}>{user._count.vehicles}</div><div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Kendaraan</div>
          </div>
          <div style={{ padding: "16px", background: "rgba(16,185,129,0.08)", borderRadius: "var(--radius-sm)", textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: 800 }}>{user._count.bookings}</div><div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Total Booking</div>
          </div>
        </div>
        
        <div style={{ marginTop: "24px" }}>
          <EditProfileForm user={{ name: user.name, phone: user.phone }} />
        </div>
      </div>
    </>
  );
}
