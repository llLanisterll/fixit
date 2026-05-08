import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import BookingForm from "./BookingForm";

export default async function NewBookingPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const userId = Number(session.user.id);
  const [vehicles, services, mechanics] = await Promise.all([
    prisma.vehicle.findMany({ where: { userId } }),
    prisma.service.findMany({ where: { isActive: true }, orderBy: { category: "asc" } }),
    prisma.mechanic.findMany({ where: { status: "AVAILABLE" } }),
  ]);
  return <BookingForm vehicles={JSON.parse(JSON.stringify(vehicles))} services={JSON.parse(JSON.stringify(services))} mechanics={JSON.parse(JSON.stringify(mechanics))} userId={userId} />;
}
