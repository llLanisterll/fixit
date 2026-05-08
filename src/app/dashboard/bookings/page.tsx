import prisma from "@/lib/prisma";
import BookingsClient from "./BookingsClient";

export default async function BookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, vehicle: true, mechanic: true, bookingServices: { include: { service: true } }, invoice: true, serviceLogs: { include: { sparepart: true } } },
  });
  const mechanics = await prisma.mechanic.findMany({ where: { status: "AVAILABLE" } });
  const spareparts = await prisma.sparepart.findMany({ orderBy: { name: "asc" } });
  return <BookingsClient bookings={JSON.parse(JSON.stringify(bookings))} mechanics={JSON.parse(JSON.stringify(mechanics))} spareparts={JSON.parse(JSON.stringify(spareparts))} />;
}
