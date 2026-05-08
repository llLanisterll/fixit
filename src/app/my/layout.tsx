"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wrench, LayoutDashboard, Car, CalendarCheck, FileText, UserCircle, LogOut, Menu, X, Plus } from "lucide-react";
import { useState } from "react";

const customerLinks = [
  { href: "/my/dashboard", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
  { href: "/my/vehicles", icon: <Car size={18} />, label: "Kendaraan Saya" },
  { href: "/my/booking/new", icon: <Plus size={18} />, label: "Booking Baru" },
  { href: "/my/bookings", icon: <CalendarCheck size={18} />, label: "Riwayat Booking" },
  { href: "/my/invoices", icon: <FileText size={18} />, label: "Invoice" },
  { href: "/my/profile", icon: <UserCircle size={18} />, label: "Profil" },
];

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <Wrench size={24} color="#3b82f6" />
          <h2>FixIt</h2>
          <button className="menu-toggle" onClick={() => setSidebarOpen(false)} style={{ marginLeft: "auto" }}><X size={20} /></button>
        </div>
        <nav className="sidebar-nav">
          <div className="sidebar-section">Menu</div>
          {customerLinks.map(link => (
            <Link key={link.href} href={link.href} className={`sidebar-link ${pathname === link.href ? "active" : ""}`} onClick={() => setSidebarOpen(false)}>
              {link.icon} {link.label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <form action={async () => { const { logoutAction } = await import("@/actions/auth"); await logoutAction(); }}>
            <button type="submit" className="sidebar-link" style={{ width: "100%", border: "none", background: "none", color: "var(--red)" }}><LogOut size={18} /> Keluar</button>
          </form>
        </div>
      </aside>
      <main className="main-content">
        <div style={{ marginBottom: "20px" }}><button className="menu-toggle btn btn-secondary btn-sm" onClick={() => setSidebarOpen(true)}><Menu size={18} /></button></div>
        {children}
      </main>
    </div>
  );
}
