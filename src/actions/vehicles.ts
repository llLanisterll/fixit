"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
}

export async function createVehicle(data: { userId: number; brand: string; model: string; year: number; licensePlate: string; color?: string }) {
  await requireAuth();
  await prisma.vehicle.create({ data });
  revalidatePath("/my/vehicles");
}

export async function updateVehicle(id: number, data: { brand: string; model: string; year: number; licensePlate: string; color?: string }) {
  await requireAuth();
  await prisma.vehicle.update({ where: { id }, data });
  revalidatePath("/my/vehicles");
}

export async function deleteVehicle(id: number) {
  await requireAuth();
  await prisma.vehicle.delete({ where: { id } });
  revalidatePath("/my/vehicles");
}
