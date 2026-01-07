import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, staffId, service, paymentMethod } = body;

    // Crear cliente si es necesario
    let customer = null;
    if (customerName && customerPhone) {
      customer = await prisma.customer.create({
        data: {
          name: customerName,
          phone: customerPhone,
        },
      });
    }

    // Crear venta/turno
    const sale = await prisma.sale.create({
      data: {
        customerId: customer?.id,
        staffId,
        paymentMethod: paymentMethod || 'CASH',
        totalAmount: 0,
        servicesText: service,
      },
    });

    return NextResponse.json(sale, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json({ error: 'Error creating appointment' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        customer: true,
        staff: true,
      },
      orderBy: {
        dateTime: 'desc',
      },
    });
    return NextResponse.json(sales);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching appointments' }, { status: 500 });
  }
}
