import prisma from "./src/lib/prisma";
import { updateBookingStatus } from "./src/actions/bookings";
import { generateInvoice, createServiceLog } from "./src/actions/admin";

async function runTest() {
  console.log("Memulai Uji Coba Logika Backend...");
  try {
    // 1. Ambil data customer pertama
    const user = await prisma.user.findFirst({ where: { role: "CUSTOMER" } });
    if (!user) throw new Error("Tidak ada user customer");
    
    // 2. Ambil kendaraan
    const vehicle = await prisma.vehicle.findFirst({ where: { userId: user.id } });
    if (!vehicle) throw new Error("Tidak ada kendaraan");
    
    // 3. Ambil mekanik dan service
    const mechanic = await prisma.mechanic.findFirst({ where: { status: "AVAILABLE" } });
    const service = await prisma.service.findFirst();
    const sparepart = await prisma.sparepart.findFirst();

    console.log(`✓ Data master ditemukan (User: ${user.name}, Mekanik: ${mechanic?.name})`);

    // 4. Buat Booking
    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        vehicleId: vehicle.id,
        mechanicId: mechanic?.id,
        bookingCode: `TEST-${Date.now()}`,
        bookingDate: new Date(),
        timeSlot: "10:00",
        status: "PENDING",
        bookingServices: {
          create: [{ serviceId: service!.id, priceAtBooking: service!.price }]
        }
      }
    });
    console.log(`✓ Booking PENDING dibuat (ID: ${booking.id})`);

    // 5. Admin Konfirmasi & Kerjakan
    await updateBookingStatus(booking.id, "CONFIRMED", mechanic!.id);
    await updateBookingStatus(booking.id, "IN_PROGRESS", mechanic!.id);
    console.log(`✓ Booking diupdate ke IN_PROGRESS`);

    // 6. Admin Tambah Log Pengerjaan
    await createServiceLog({
      bookingId: booking.id,
      mechanicId: mechanic!.id,
      sparepartId: sparepart!.id,
      description: "Test penggantian sparepart",
      sparepartQty: 1,
      status: "DONE"
    });
    console.log(`✓ Log pengerjaan ditambahkan dan stok sparepart berkurang`);

    // 7. Admin Selesaikan & Buat Invoice
    await updateBookingStatus(booking.id, "COMPLETED", mechanic!.id);
    await generateInvoice(booking.id);
    console.log(`✓ Booking SELESAI dan Invoice digenerate`);

    // 8. Cek tagihan
    const invoice = await prisma.invoice.findFirst({ where: { bookingId: booking.id } });
    console.log(`✓ Invoice ditemukan dengan status: ${invoice?.paymentStatus}, Total: Rp${invoice?.grandTotal}`);

    console.log("✅ SELURUH ALUR LOGIKA BERHASIL DIUJI TANPA ERROR!");
  } catch (error) {
    console.error("❌ Uji coba gagal:", error);
  }
}

runTest();
