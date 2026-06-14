import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const vehicles = await prisma.vehicle.findMany({
      where: { userId: Number(session.user.id) },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(vehicles);
  } catch (error) {
    console.error("[VEHICLES_GET]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { brand, model, year, licensePlate, color } = body;

    if (!brand || !model || !year || !licensePlate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        userId: Number(session.user.id),
        brand,
        model,
        year: Number(year),
        licensePlate,
        color,
      },
    });

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error("[VEHICLES_POST]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
