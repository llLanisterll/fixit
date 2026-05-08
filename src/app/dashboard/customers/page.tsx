import prisma from "@/lib/prisma";
import { UserCircle, Car, CalendarCheck } from "lucide-react";

export default async function CustomersPage() {
  const customers = await prisma.user.findMany({ where: { role: "CUSTOMER" }, include: { vehicles: true, _count: { select: { bookings: true } } }, orderBy: { createdAt: "desc" } });
  return (
    <>
      <div className="page-header"><div><h1><UserCircle size={24} style={{ display: "inline", marginRight: "8px" }} />Pelanggan</h1><p>{customers.length} pelanggan terdaftar</p></div></div>
      <div className="table-wrapper">
        <table className="table">
          <thead><tr><th>Nama</th><th>Email</th><th>Telepon</th><th>Kendaraan</th><th>Total Booking</th><th>Bergabung</th></tr></thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id}>
                <td><strong>{c.name}</strong></td>
                <td>{c.email}</td>
                <td>{c.phone || "-"}</td>
                <td>{c.vehicles.map(v => `${v.brand} ${v.model} (${v.licensePlate})`).join(", ") || "-"}</td>
                <td><span className="badge badge-confirmed"><CalendarCheck size={12} /> {c._count.bookings}</span></td>
                <td>{new Date(c.createdAt).toLocaleDateString("id-ID")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
