"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";

export async function updateProfile(data: { name: string; phone: string; password?: string }) {
  const session = await auth();
  if (!session?.user) return { error: "Not authenticated" };
  
  const updateData: any = { name: data.name, phone: data.phone };
  
  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }
  
  await prisma.user.update({
    where: { id: Number(session.user.id) },
    data: updateData
  });
  
  revalidatePath("/my/profile");
  return { success: true };
}
