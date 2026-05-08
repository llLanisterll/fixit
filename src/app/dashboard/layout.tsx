"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wrench, LayoutDashboard, CalendarCheck, Users, Settings, Package, FileText, UserCircle, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

const adminLinks = [
  { href: "/dashboard", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
  { href: "/dashboard/bookings", icon: <CalendarCheck size={18} />, label: "Bookings" },
  { href: "/dashboard/mechanics", icon: <Users size={18} />, label: "Mekanik" },
  { href: "/dashboard/services", icon: <Settings size={18} />, label: "Layanan" },
  { href: "/dashboard/spareparts", icon: <Package size={18} />, label: "Spareparts" },
  { href: "/dashboard/customers", icon: <UserCircle size={18} />, label: "Pelanggan" },
  { href: "/dashboard/invoices", icon: <FileText size={18} />, label: "Invoice" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <Wrench size={24} color="#3b82f6" />
          <h2>FixIt</h2>
          <span className="badge badge-confirmed" style={{ marginLeft: "auto", fontSize: "10px" }}>ADMIN</span>
          <button className="menu-toggle" onClick={() => setSidebarOpen(false)} style={{ marginLeft: "8px" }}><X size={20} /></button>
        </div>
        <nav className="sidebar-nav">
          <div className="sidebar-section">Menu Utama</div>
          {adminLinks.map(link => (
            <Link key={link.href} href={link.href} className={`sidebar-link ${pathname === link.href ? "active" : ""}`} onClick={() => setSidebarOpen(false)}>
              {link.icon} {link.label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <form action={async () => { const { logoutAction } = await import("@/actions/auth"); await logoutAction(); }}>
            <button type="submit" className="sidebar-link" style={{ width: "100%", border: "none", background: "none", color: "var(--red)" }}>
              <LogOut size={18} /> Keluar
            </button>
          </form>
        </div>
      </aside>
      <main className="main-content">
        <div style={{ marginBottom: "20px" }}>
          <button className="menu-toggle btn btn-secondary btn-sm" onClick={() => setSidebarOpen(true)}><Menu size={18} /></button>
        </div>
        {children}
      </main>
    </div>
  );
}
