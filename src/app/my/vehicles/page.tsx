export const dynamic = "force-dynamic";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import VehiclesClient from "./VehiclesClient";

export default async function VehiclesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const userId = Number(session.user.id);
  const vehicles = await prisma.vehicle.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  return <VehiclesClient vehicles={JSON.parse(JSON.stringify(vehicles))} userId={userId} />;
}
