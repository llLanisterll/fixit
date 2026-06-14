import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: Number(session.user.id) },
      include: {
        vehicle: true,
        mechanic: true,
        bookingServices: {
          include: {
            service: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("[BOOKINGS_GET]", error);
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
    const { vehicleId, bookingDate, timeSlot, notes, serviceIds } = body;

    if (!vehicleId || !bookingDate || !timeSlot || !serviceIds || !serviceIds.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify services exist to get their prices
    const services = await prisma.service.findMany({
      where: {
        id: { in: serviceIds },
        isActive: true,
      },
    });

    if (services.length !== serviceIds.length) {
      return NextResponse.json({ error: "Some services are invalid or inactive" }, { status: 400 });
    }

    // Generate unique booking code
    const bookingCode = `BK-${Date.now().toString().slice(-6)}`;

    // Create booking and booking services in a transaction
    const booking = await prisma.$transaction(async (tx) => {
      const newBooking = await tx.booking.create({
        data: {
          bookingCode,
          userId: Number(session.user.id),
          vehicleId: Number(vehicleId),
          bookingDate: new Date(bookingDate),
          timeSlot,
          notes,
          status: "PENDING",
        },
      });

      const bookingServicesData = services.map((service) => ({
        bookingId: newBooking.id,
        serviceId: service.id,
        priceAtBooking: service.price,
        quantity: 1,
      }));

      await tx.bookingService.createMany({
        data: bookingServicesData,
      });

      return newBooking;
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("[BOOKINGS_POST]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
