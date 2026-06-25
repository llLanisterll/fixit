export const dynamic = "force-dynamic";
import prisma from "@/lib/prisma";
import SparepartsClient from "./SparepartsClient";
export default async function SparepartsPage() {
  const spareparts = await prisma.sparepart.findMany({ orderBy: { name: "asc" } });
  return <SparepartsClient spareparts={JSON.parse(JSON.stringify(spareparts))} />;
}
