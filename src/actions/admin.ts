"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createService(data: { name: string; description?: string; category: string; price: number; estimatedMinutes: number }) {
  await prisma.service.create({ data });
  revalidatePath("/dashboard/services");
}
export async function updateService(id: number, data: { name: string; description?: string; category: string; price: number; estimatedMinutes: number; isActive: boolean }) {
  await prisma.service.update({ where: { id }, data });
  revalidatePath("/dashboard/services");
}
export async function deleteService(id: number) {
  await prisma.service.delete({ where: { id } });
  revalidatePath("/dashboard/services");
}

export async function createMechanic(data: { name: string; phone?: string; specialization?: string }) {
  await prisma.mechanic.create({ data });
  revalidatePath("/dashboard/mechanics");
}
export async function updateMechanic(id: number, data: { name: string; phone?: string; specialization?: string; status: string }) {
  await prisma.mechanic.update({ where: { id }, data });
  revalidatePath("/dashboard/mechanics");
}
export async function deleteMechanic(id: number) {
  await prisma.mechanic.delete({ where: { id } });
  revalidatePath("/dashboard/mechanics");
}

export async function createSparepart(data: { name: string; partNumber: string; brand?: string; stock: number; price: number; unit: string; minStock: number }) {
  await prisma.sparepart.create({ data });
  revalidatePath("/dashboard/spareparts");
}
export async function updateSparepart(id: number, data: { name: string; partNumber: string; brand?: string; stock: number; price: number; unit: string; minStock: number }) {
  await prisma.sparepart.update({ where: { id }, data });
  revalidatePath("/dashboard/spareparts");
}
export async function deleteSparepart(id: number) {
  await prisma.sparepart.delete({ where: { id } });
  revalidatePath("/dashboard/spareparts");
}

export async function createServiceLog(data: { bookingId: number; mechanicId: number; sparepartId?: number; description: string; sparepartQty: number; status: string }) {
  if (data.sparepartId && data.sparepartQty > 0) {
    await prisma.sparepart.update({ where: { id: data.sparepartId }, data: { stock: { decrement: data.sparepartQty } } });
  }
  await prisma.serviceLog.create({ data: { ...data, sparepartId: data.sparepartId || null } });
  revalidatePath("/dashboard/bookings");
}

export async function generateInvoice(bookingId: number) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId }, include: { bookingServices: true, serviceLogs: { include: { sparepart: true } } } });
  if (!booking) return;
  const serviceCost = booking.bookingServices.reduce((sum, bs) => sum + bs.priceAtBooking * bs.quantity, 0);
  const sparepartCost = booking.serviceLogs.reduce((sum, sl) => sum + (sl.sparepart ? sl.sparepart.price * sl.sparepartQty : 0), 0);
  const totalCost = serviceCost + sparepartCost;
  const tax = totalCost * 0.1;
  const grandTotal = totalCost + tax;
  const count = await prisma.invoice.count();
  await prisma.invoice.create({
    data: { invoiceNumber: `INV-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`, bookingId, serviceCost, sparepartCost, totalCost, tax, grandTotal },
  });
  revalidatePath("/dashboard/invoices");
}

export async function markInvoicePaid(id: number, method: string) {
  await prisma.invoice.update({ where: { id }, data: { paymentStatus: "PAID", paymentMethod: method, paidAt: new Date() } });
  revalidatePath("/dashboard/invoices");
  revalidatePath("/my/invoices");
}
