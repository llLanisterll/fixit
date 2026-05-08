"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createVehicle(data: { userId: number; brand: string; model: string; year: number; licensePlate: string; color?: string }) {
  await prisma.vehicle.create({ data });
  revalidatePath("/my/vehicles");
}

export async function updateVehicle(id: number, data: { brand: string; model: string; year: number; licensePlate: string; color?: string }) {
  await prisma.vehicle.update({ where: { id }, data });
  revalidatePath("/my/vehicles");
}

export async function deleteVehicle(id: number) {
  await prisma.vehicle.delete({ where: { id } });
  revalidatePath("/my/vehicles");
}
