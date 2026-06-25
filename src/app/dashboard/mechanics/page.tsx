export const dynamic = "force-dynamic";
import prisma from "@/lib/prisma";
import MechanicsClient from "./MechanicsClient";

export default async function MechanicsPage() {
  const mechanics = await prisma.mechanic.findMany({ orderBy: { createdAt: "desc" }, include: { _count: { select: { bookings: true } } } });
  return <MechanicsClient mechanics={JSON.parse(JSON.stringify(mechanics))} />;
}
