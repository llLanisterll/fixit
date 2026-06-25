export const dynamic = "force-dynamic";
import prisma from "@/lib/prisma";
import InvoicesClient from "./InvoicesClient";
export default async function InvoicesPage() {
  const invoices = await prisma.invoice.findMany({ orderBy: { createdAt: "desc" }, include: { booking: { include: { user: true, vehicle: true, bookingServices: { include: { service: true } } } } } });
  return <InvoicesClient invoices={JSON.parse(JSON.stringify(invoices))} />;
}
