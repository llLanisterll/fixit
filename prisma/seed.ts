import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.serviceLog.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.bookingService.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.sparepart.deleteMany();
  await prisma.mechanic.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin Bengkel FixIt',
      email: 'admin@fixit.com',
      password: adminPassword,
      role: 'ADMIN',
      phone: '08123456789',
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      name: 'Ahmad Rizky',
      email: 'ahmad@email.com',
      password: userPassword,
      role: 'CUSTOMER',
      phone: '08198765432',
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      name: 'Siti Nurhaliza',
      email: 'siti@email.com',
      password: userPassword,
      role: 'CUSTOMER',
      phone: '08187654321',
    },
  });

  const customer3 = await prisma.user.create({
    data: {
      name: 'Budi Santoso',
      email: 'budi@email.com',
      password: userPassword,
      role: 'CUSTOMER',
      phone: '08176543210',
    },
  });

  console.log('✅ Users seeded');

  // Create Vehicles
  const vehicle1 = await prisma.vehicle.create({
    data: {
      userId: customer1.id,
      brand: 'Toyota',
      model: 'Avanza',
      year: 2022,
      licensePlate: 'DD 1234 AB',
      color: 'Putih',
    },
  });

  const vehicle2 = await prisma.vehicle.create({
    data: {
      userId: customer1.id,
      brand: 'Honda',
      model: 'Beat',
      year: 2023,
      licensePlate: 'DD 5678 CD',
      color: 'Merah',
    },
  });

  const vehicle3 = await prisma.vehicle.create({
    data: {
      userId: customer2.id,
      brand: 'Yamaha',
      model: 'NMAX',
      year: 2024,
      licensePlate: 'DD 9012 EF',
      color: 'Hitam',
    },
  });

  const vehicle4 = await prisma.vehicle.create({
    data: {
      userId: customer3.id,
      brand: 'Suzuki',
      model: 'Ertiga',
      year: 2021,
      licensePlate: 'DD 3456 GH',
      color: 'Silver',
    },
  });

  console.log('✅ Vehicles seeded');

  // Create Services
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: 'Ganti Oli Mesin',
        description: 'Penggantian oli mesin dengan oli berkualitas tinggi',
        category: 'ROUTINE',
        price: 150000,
        estimatedMinutes: 30,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Tune Up Mesin',
        description: 'Penyetelan dan pembersihan komponen mesin agar performa optimal',
        category: 'ROUTINE',
        price: 250000,
        estimatedMinutes: 60,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Servis Rem',
        description: 'Pemeriksaan dan penggantian kampas rem, minyak rem',
        category: 'ROUTINE',
        price: 200000,
        estimatedMinutes: 45,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Ganti Aki',
        description: 'Penggantian aki kendaraan dengan aki baru',
        category: 'ROUTINE',
        price: 350000,
        estimatedMinutes: 20,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Servis AC',
        description: 'Pemeriksaan, pembersihan, dan isi ulang freon AC kendaraan',
        category: 'ROUTINE',
        price: 300000,
        estimatedMinutes: 90,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Overhaul Mesin',
        description: 'Pembongkaran total mesin untuk perbaikan menyeluruh',
        category: 'HEAVY',
        price: 3500000,
        estimatedMinutes: 480,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Ganti Kopling',
        description: 'Penggantian set kopling kendaraan',
        category: 'HEAVY',
        price: 1500000,
        estimatedMinutes: 180,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Perbaikan Transmisi',
        description: 'Diagnosa dan perbaikan sistem transmisi kendaraan',
        category: 'HEAVY',
        price: 2500000,
        estimatedMinutes: 300,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Spooring & Balancing',
        description: 'Penyetelan sudut roda dan balancing ban untuk kenyamanan berkendara',
        category: 'ROUTINE',
        price: 200000,
        estimatedMinutes: 60,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Ganti V-Belt',
        description: 'Penggantian V-belt motor matic',
        category: 'ROUTINE',
        price: 180000,
        estimatedMinutes: 45,
      },
    }),
  ]);

  console.log('✅ Services seeded');

  // Create Mechanics
  const mechanic1 = await prisma.mechanic.create({
    data: {
      name: 'Andi Pratama',
      phone: '08111222333',
      specialization: 'Mesin & Tune Up',
      status: 'AVAILABLE',
    },
  });

  const mechanic2 = await prisma.mechanic.create({
    data: {
      name: 'Reza Fadillah',
      phone: '08111222444',
      specialization: 'Kelistrikan & AC',
      status: 'AVAILABLE',
    },
  });

  const mechanic3 = await prisma.mechanic.create({
    data: {
      name: 'Dimas Saputra',
      phone: '08111222555',
      specialization: 'Transmisi & Kopling',
      status: 'BUSY',
    },
  });

  const mechanic4 = await prisma.mechanic.create({
    data: {
      name: 'Fajar Nugroho',
      phone: '08111222666',
      specialization: 'Rem & Suspensi',
      status: 'AVAILABLE',
    },
  });

  const mechanic5 = await prisma.mechanic.create({
    data: {
      name: 'Hendra Wijaya',
      phone: '08111222777',
      specialization: 'Overhaul & Body Repair',
      status: 'OFF',
    },
  });

  console.log('✅ Mechanics seeded');

  // Create Spareparts
  const spareparts = await Promise.all([
    prisma.sparepart.create({ data: { name: 'Oli Mesin 10W-40 (1L)', partNumber: 'OIL-1040-1L', brand: 'Castrol', stock: 50, price: 85000, unit: 'liter', minStock: 10 } }),
    prisma.sparepart.create({ data: { name: 'Oli Mesin 5W-30 (1L)', partNumber: 'OIL-0530-1L', brand: 'Shell', stock: 40, price: 95000, unit: 'liter', minStock: 10 } }),
    prisma.sparepart.create({ data: { name: 'Filter Oli', partNumber: 'FLT-OIL-001', brand: 'Denso', stock: 30, price: 45000, unit: 'pcs', minStock: 5 } }),
    prisma.sparepart.create({ data: { name: 'Filter Udara', partNumber: 'FLT-AIR-001', brand: 'Denso', stock: 25, price: 55000, unit: 'pcs', minStock: 5 } }),
    prisma.sparepart.create({ data: { name: 'Busi NGK Iridium', partNumber: 'SPK-NGK-IR1', brand: 'NGK', stock: 40, price: 65000, unit: 'pcs', minStock: 8 } }),
    prisma.sparepart.create({ data: { name: 'Kampas Rem Depan', partNumber: 'BRK-PAD-F01', brand: 'Bendix', stock: 20, price: 180000, unit: 'set', minStock: 4 } }),
    prisma.sparepart.create({ data: { name: 'Kampas Rem Belakang', partNumber: 'BRK-PAD-R01', brand: 'Bendix', stock: 18, price: 150000, unit: 'set', minStock: 4 } }),
    prisma.sparepart.create({ data: { name: 'Minyak Rem DOT 4', partNumber: 'BRK-FLD-D04', brand: 'Prestone', stock: 15, price: 45000, unit: 'botol', minStock: 5 } }),
    prisma.sparepart.create({ data: { name: 'Aki 12V 35Ah', partNumber: 'BAT-12V-35A', brand: 'GS Astra', stock: 8, price: 450000, unit: 'pcs', minStock: 3 } }),
    prisma.sparepart.create({ data: { name: 'Aki 12V 45Ah', partNumber: 'BAT-12V-45A', brand: 'Yuasa', stock: 6, price: 650000, unit: 'pcs', minStock: 3 } }),
    prisma.sparepart.create({ data: { name: 'V-Belt Motor Matic', partNumber: 'VBL-MTR-001', brand: 'Gates', stock: 12, price: 95000, unit: 'pcs', minStock: 3 } }),
    prisma.sparepart.create({ data: { name: 'Freon R134a (250g)', partNumber: 'FRN-134A-250', brand: 'Dupont', stock: 20, price: 75000, unit: 'kaleng', minStock: 5 } }),
    prisma.sparepart.create({ data: { name: 'Kopling Set Mobil', partNumber: 'CLT-SET-001', brand: 'Exedy', stock: 4, price: 850000, unit: 'set', minStock: 2 } }),
    prisma.sparepart.create({ data: { name: 'Oli Transmisi ATF', partNumber: 'OIL-ATF-001', brand: 'Toyota', stock: 15, price: 120000, unit: 'liter', minStock: 5 } }),
    prisma.sparepart.create({ data: { name: 'Air Radiator Coolant', partNumber: 'CLN-RAD-001', brand: 'Prestone', stock: 3, price: 65000, unit: 'liter', minStock: 5 } }),
    prisma.sparepart.create({ data: { name: 'Lampu Depan LED H4', partNumber: 'LMP-LED-H4', brand: 'Philips', stock: 10, price: 250000, unit: 'pcs', minStock: 3 } }),
    prisma.sparepart.create({ data: { name: 'Wiper Blade 20"', partNumber: 'WPR-BLD-20', brand: 'Bosch', stock: 8, price: 85000, unit: 'pcs', minStock: 3 } }),
    prisma.sparepart.create({ data: { name: 'Ban Mobil 185/65R15', partNumber: 'TIR-185-R15', brand: 'Bridgestone', stock: 2, price: 750000, unit: 'pcs', minStock: 4 } }),
    prisma.sparepart.create({ data: { name: 'Ban Motor 80/90-17', partNumber: 'TIR-80-R17', brand: 'IRC', stock: 10, price: 195000, unit: 'pcs', minStock: 4 } }),
    prisma.sparepart.create({ data: { name: 'Bearing Roda Depan', partNumber: 'BRG-WHL-F01', brand: 'NTN', stock: 6, price: 120000, unit: 'pcs', minStock: 2 } }),
  ]);

  console.log('✅ Spareparts seeded');

  // Create Bookings with booking services
  const booking1 = await prisma.booking.create({
    data: {
      bookingCode: 'FIX-2026-0001',
      userId: customer1.id,
      vehicleId: vehicle1.id,
      mechanicId: mechanic1.id,
      bookingDate: new Date('2026-05-10T08:00:00'),
      timeSlot: '08:00 - 09:00',
      status: 'COMPLETED',
      notes: 'Servis rutin berkala 10.000 km',
      bookingServices: {
        create: [
          { serviceId: services[0].id, priceAtBooking: services[0].price, quantity: 1 },
          { serviceId: services[1].id, priceAtBooking: services[1].price, quantity: 1 },
        ],
      },
    },
  });

  const booking2 = await prisma.booking.create({
    data: {
      bookingCode: 'FIX-2026-0002',
      userId: customer2.id,
      vehicleId: vehicle3.id,
      mechanicId: mechanic2.id,
      bookingDate: new Date('2026-05-11T10:00:00'),
      timeSlot: '10:00 - 11:00',
      status: 'IN_PROGRESS',
      notes: 'AC tidak dingin',
      bookingServices: {
        create: [
          { serviceId: services[4].id, priceAtBooking: services[4].price, quantity: 1 },
        ],
      },
    },
  });

  const booking3 = await prisma.booking.create({
    data: {
      bookingCode: 'FIX-2026-0003',
      userId: customer3.id,
      vehicleId: vehicle4.id,
      mechanicId: mechanic3.id,
      bookingDate: new Date('2026-05-12T09:00:00'),
      timeSlot: '09:00 - 10:00',
      status: 'CONFIRMED',
      notes: 'Kopling terasa berat saat diganti gigi',
      bookingServices: {
        create: [
          { serviceId: services[6].id, priceAtBooking: services[6].price, quantity: 1 },
        ],
      },
    },
  });

  const booking4 = await prisma.booking.create({
    data: {
      bookingCode: 'FIX-2026-0004',
      userId: customer1.id,
      vehicleId: vehicle2.id,
      mechanicId: null,
      bookingDate: new Date('2026-05-13T14:00:00'),
      timeSlot: '14:00 - 15:00',
      status: 'PENDING',
      notes: 'Ganti V-Belt dan servis rutin motor',
      bookingServices: {
        create: [
          { serviceId: services[9].id, priceAtBooking: services[9].price, quantity: 1 },
          { serviceId: services[0].id, priceAtBooking: services[0].price, quantity: 1 },
        ],
      },
    },
  });

  console.log('✅ Bookings seeded');

  // Create Service Logs
  await prisma.serviceLog.create({
    data: {
      bookingId: booking1.id,
      mechanicId: mechanic1.id,
      sparepartId: spareparts[0].id,
      description: 'Penggantian oli mesin lama dengan oli baru Castrol 10W-40',
      sparepartQty: 4,
      status: 'DONE',
      logDate: new Date('2026-05-10T08:30:00'),
    },
  });

  await prisma.serviceLog.create({
    data: {
      bookingId: booking1.id,
      mechanicId: mechanic1.id,
      sparepartId: spareparts[2].id,
      description: 'Penggantian filter oli',
      sparepartQty: 1,
      status: 'DONE',
      logDate: new Date('2026-05-10T08:45:00'),
    },
  });

  await prisma.serviceLog.create({
    data: {
      bookingId: booking1.id,
      mechanicId: mechanic1.id,
      sparepartId: spareparts[4].id,
      description: 'Tune up: pembersihan karburator, ganti busi',
      sparepartQty: 4,
      status: 'DONE',
      logDate: new Date('2026-05-10T09:15:00'),
    },
  });

  await prisma.serviceLog.create({
    data: {
      bookingId: booking2.id,
      mechanicId: mechanic2.id,
      sparepartId: spareparts[11].id,
      description: 'Pengecekan tekanan freon, isi ulang freon R134a',
      sparepartQty: 2,
      status: 'IN_PROGRESS',
      logDate: new Date('2026-05-11T10:30:00'),
    },
  });

  console.log('✅ Service Logs seeded');

  // Create Invoices
  await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-2026-0001',
      bookingId: booking1.id,
      serviceCost: 400000,
      sparepartCost: 645000,
      totalCost: 1045000,
      tax: 104500,
      grandTotal: 1149500,
      paymentStatus: 'PAID',
      paymentMethod: 'Transfer Bank',
      paidAt: new Date('2026-05-10T10:00:00'),
    },
  });

  await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-2026-0002',
      bookingId: booking2.id,
      serviceCost: 300000,
      sparepartCost: 150000,
      totalCost: 450000,
      tax: 45000,
      grandTotal: 495000,
      paymentStatus: 'UNPAID',
    },
  });

  console.log('✅ Invoices seeded');
  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
