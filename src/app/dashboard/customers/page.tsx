export const dynamic = "force-dynamic";
import prisma from "@/lib/prisma";
import CustomersClient from "./CustomersClient";

export default async function CustomersPage() {
  const customers = await prisma.user.findMany({ where: { role: "CUSTOMER" }, include: { vehicles: true, _count: { select: { bookings: true } } }, orderBy: { createdAt: "desc" } });
  return <CustomersClient customers={customers} />;
}
