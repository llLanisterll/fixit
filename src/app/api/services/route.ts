import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    // Services are usually public or available to all logged in users
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { category: "asc" },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error("[SERVICES_GET]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
