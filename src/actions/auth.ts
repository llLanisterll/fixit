"use server";
import { signIn, signOut } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  try {
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) return { error: "Email atau password salah" };
  } catch {
    return { error: "Email atau password salah" };
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (user?.role === "ADMIN") redirect("/dashboard");
  redirect("/my/dashboard");
}

export async function registerAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const phone = formData.get("phone") as string;
  if (!name || !email || !password) return { error: "Semua field harus diisi" };
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return { error: "Email sudah terdaftar" };
  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { name, email, password: hashed, phone, role: "CUSTOMER" } });
  try {
    await signIn("credentials", { email, password, redirect: false });
  } catch { /* ignore */ }
  redirect("/my/dashboard");
}

export async function logoutAction() {
  await signOut({ redirect: false });
  redirect("/login");
}
