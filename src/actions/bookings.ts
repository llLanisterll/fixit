"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

export async function updateBookingStatus(bookingId: number, status: string, mechanicId?: number) {
  const session = await requireAuth();
  if (session.user.role !== "ADMIN") throw new Error("Unauthorized");
  await prisma.booking.update({ where: { id: bookingId }, data: { status, ...(mechanicId ? { mechanicId } : {}) } });
  if (mechanicId) await prisma.mechanic.update({ where: { id: mechanicId }, data: { status: status === "IN_PROGRESS" ? "BUSY" : "AVAILABLE" } });
  revalidatePath("/dashboard/bookings");
  revalidatePath("/my/bookings");
}

export async function createBooking(data: { userId: number; vehicleId: number; mechanicId?: number; bookingDate: string; timeSlot: string; notes?: string; serviceIds: number[] }) {
  await requireAuth();
  
  // Conflict Validation
  const bookingDate = new Date(data.bookingDate);
  const timeSlot = data.timeSlot;
  
  if (data.mechanicId) {
    const conflict = await prisma.booking.findFirst({
      where: {
        mechanicId: data.mechanicId,
        bookingDate: bookingDate,
        timeSlot: timeSlot,
        status: { not: "CANCELLED" }
      }
    });
    if (conflict) {
      throw new Error("Mekanik tersebut sudah dibooking pada jam dan tanggal ini. Silakan pilih jam atau mekanik lain.");
    }
  } else {
    // Check if ALL mechanics are busy
    const totalMechanics = await prisma.mechanic.count();
    const busyMechanicsCount = await prisma.booking.count({
      where: {
        bookingDate: bookingDate,
        timeSlot: timeSlot,
        status: { not: "CANCELLED" }
      }
    });
    if (busyMechanicsCount >= totalMechanics) {
      throw new Error("Semua mekanik sedang sibuk pada jam dan tanggal ini. Silakan pilih jam atau tanggal lain.");
    }
  }

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
  await requireAuth();
  const booking = await prisma.booking.update({ where: { id: bookingId }, data: { status: "CANCELLED" } });
  if (booking.mechanicId) await prisma.mechanic.update({ where: { id: booking.mechanicId }, data: { status: "AVAILABLE" } });
  revalidatePath("/my/bookings");
  revalidatePath("/dashboard/bookings");
}
