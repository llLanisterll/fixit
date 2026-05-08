"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function simulatePayment(invoiceId: number) {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated");

  // Verify the invoice belongs to the user
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { booking: true }
  });

  if (!invoice || invoice.booking.userId !== Number(session.user.id)) {
    throw new Error("Unauthorized");
  }

  await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      paymentStatus: "PAID",
      paymentMethod: "TRANSFER",
      paidAt: new Date()
    }
  });

  revalidatePath("/my/invoices");
  return { success: true };
}
