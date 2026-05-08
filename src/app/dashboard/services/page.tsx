import prisma from "@/lib/prisma";
import ServicesClient from "./ServicesClient";
export default async function ServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { id: "asc" } });
  return <ServicesClient services={JSON.parse(JSON.stringify(services))} />;
}
