"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateBookingStatus(bookingId: number, status: string, mechanicId?: number) {
  await prisma.booking.update({ where: { id: bookingId }, data: { status, ...(mechanicId ? { mechanicId } : {}) } });
  if (mechanicId) await prisma.mechanic.update({ where: { id: mechanicId }, data: { status: status === "IN_PROGRESS" ? "BUSY" : "AVAILABLE" } });
  revalidatePath("/dashboard/bookings");
  revalidatePath("/my/bookings");
}

export async function createBooking(data: { userId: number; vehicleId: number; mechanicId?: number; bookingDate: string; timeSlot: string; notes?: string; serviceIds: number[] }) {
  const code = `FIX-${new Date().getFullYear()}-${String(await prisma.booking.count() + 1).padStart(4, "0")}`;
  const services = await prisma.service.findMany({ where: { id: { in: data.serviceIds } } });
  const booking = await prisma.booking.create({
    data: {
      bookingCode: code, userId: data.userId, vehicleId: data.vehicleId,
      mechanicId: data.mechanicId || null, bookingDate: new Date(data.bookingDate),
      timeSlot: data.timeSlot, notes: data.notes || null,
      bookingServices: { create: services.map(s => ({ serviceId: s.id, priceAtBooking: s.price, quantity: 1 })) },
    },
  });
  revalidatePath("/my/bookings");
  revalidatePath("/dashboard/bookings");
  return booking;
}

export async function cancelBooking(bookingId: number) {
  const booking = await prisma.booking.update({ where: { id: bookingId }, data: { status: "CANCELLED" } });
  if (booking.mechanicId) await prisma.mechanic.update({ where: { id: booking.mechanicId }, data: { status: "AVAILABLE" } });
  revalidatePath("/my/bookings");
  revalidatePath("/dashboard/bookings");
}
