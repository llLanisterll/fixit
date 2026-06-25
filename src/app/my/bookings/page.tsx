export const dynamic = "force-dynamic";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import BookingsListClient from "./BookingsListClient";

export default async function BookingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const userId = Number(session.user.id);
  const bookings = await prisma.booking.findMany({
    where: { userId }, orderBy: { createdAt: "desc" },
    include: { vehicle: true, mechanic: true, bookingServices: { include: { service: true } }, serviceLogs: { include: { mechanic: true, sparepart: true } }, invoice: true },
  });
  return <BookingsListClient bookings={JSON.parse(JSON.stringify(bookings))} />;
}
