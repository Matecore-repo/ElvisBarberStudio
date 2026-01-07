import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de datos...');

  // Limpiar datos existentes
  await prisma.commissionPayment.deleteMany();
  await prisma.cashClosing.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.user.deleteMany();

  // Hash de contraseñas
  const adminHash = await bcrypt.hash('admin123', 10);
  const elvishHash = await bcrypt.hash('elvis123', 10);
  const carlosHash = await bcrypt.hash('carlos123', 10);
  const juanHash = await bcrypt.hash('juan123', 10);
  const miguelHash = await bcrypt.hash('miguel123', 10);

  // Crear usuario admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@barber.com',
      name: 'Admin',
      passwordHash: adminHash,
      role: 'admin',
    },
  });
  console.log('✅ Usuario admin creado');

  // Crear usuario owner (Elvis)
  const owner = await prisma.user.create({
    data: {
      email: 'elvis@barber.com',
      name: 'Elvis',
      passwordHash: elvishHash,
      role: 'owner',
    },
  });
  console.log('✅ Usuario owner (Elvis) creado');

  // Crear staff (barberos)
  const staff1 = await prisma.staff.create({
    data: {
      name: 'Carlos',
      commissionRateDefault: 0.4,
      active: true,
    },
  });

  const staff2 = await prisma.staff.create({
    data: {
      name: 'Juan',
      commissionRateDefault: 0.35,
      active: true,
    },
  });

  const staff3 = await prisma.staff.create({
    data: {
      name: 'Miguel',
      commissionRateDefault: 0.4,
      active: true,
    },
  });

  console.log('✅ Barberos creados');

  // Crear usuarios para barberos
  const barberUser1 = await prisma.user.create({
    data: {
      email: 'carlos@barber.com',
      name: 'Carlos',
      passwordHash: carlosHash,
      role: 'barber',
      staffId: staff1.id,
    },
  });

  const barberUser2 = await prisma.user.create({
    data: {
      email: 'juan@barber.com',
      name: 'Juan',
      passwordHash: juanHash,
      role: 'barber',
      staffId: staff2.id,
    },
  });

  const barberUser3 = await prisma.user.create({
    data: {
      email: 'miguel@barber.com',
      name: 'Miguel',
      passwordHash: miguelHash,
      role: 'barber',
      staffId: staff3.id,
    },
  });

  console.log('✅ Usuarios de barberos creados');

  // Crear clientes
  const customer1 = await prisma.customer.create({
    data: {
      name: 'Pedro García',
      phone: '1123456789',
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: 'Lucas Martínez',
      phone: '1187654321',
    },
  });

  const customer3 = await prisma.customer.create({
    data: {
      name: 'Roberto López',
      phone: '1145678901',
    },
  });

  console.log('✅ Clientes creados');

  // Crear ventas (turnos completados)
  const sale1 = await prisma.sale.create({
    data: {
      customerId: customer1.id,
      staffId: staff1.id,
      paymentMethod: 'CASH',
      totalAmount: 100,
      servicesText: 'Corte Clásico',
    },
  });

  const sale2 = await prisma.sale.create({
    data: {
      customerId: customer2.id,
      staffId: staff2.id,
      paymentMethod: 'CASH',
      totalAmount: 120,
      servicesText: 'Corte Degradado',
    },
  });

  const sale3 = await prisma.sale.create({
    data: {
      customerId: customer3.id,
      staffId: staff3.id,
      paymentMethod: 'MP',
      totalAmount: 150,
      servicesText: 'Corte + Barba',
    },
  });

  console.log('✅ Ventas creadas');

  // Crear comisiones
  const now = new Date();
  const commission1 = await prisma.commissionPayment.create({
    data: {
      staffId: staff1.id,
      periodStart: new Date(now.getFullYear(), now.getMonth(), 1),
      periodEnd: now,
      totalSales: 100,
      commissionRate: 0.4,
      commissionAmount: 40,
      status: 'PENDING',
    },
  });

  const commission2 = await prisma.commissionPayment.create({
    data: {
      staffId: staff2.id,
      periodStart: new Date(now.getFullYear(), now.getMonth(), 1),
      periodEnd: now,
      totalSales: 120,
      commissionRate: 0.35,
      commissionAmount: 42,
      status: 'PAID',
    },
  });

  console.log('✅ Comisiones creadas');

  console.log('\n✅ Seed completado exitosamente!');
  console.log('\n📝 Credenciales de acceso:');
  console.log('  Admin: admin@barber.com / admin123');
  console.log('  Owner: elvis@barber.com / elvis123');
  console.log('  Barber 1: carlos@barber.com / carlos123');
  console.log('  Barber 2: juan@barber.com / juan123');
  console.log('  Barber 3: miguel@barber.com / miguel123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
