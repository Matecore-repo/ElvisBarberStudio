import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, staffId, service, paymentMethod, clientId } = body;

    // Crear cliente si es necesario
    let customerIdToUse = clientId;

    if (!customerIdToUse && customerName && customerPhone) {
      const customer = await prisma.customer.create({
        data: {
          name: customerName,
          phone: customerPhone,
        },
      });
      customerIdToUse = customer.id;
    }

    // Crear venta/turno
    const sale = await prisma.sale.create({
      data: {
        customerId: customerIdToUse,
        staffId,
        paymentMethod: null, // Es un turno, no pagado aún
        totalAmount: 0,
        servicesText: service || 'Turno', // Fallback
        // Guardar fecha y hora separados
        date: new Date(body.date), // YYYY-MM-DD
        time: body.time,           // HH:mm
        // Mantener dateTime sincronizado para ordenamiento
        dateTime: new Date(`${body.date}T${body.time}:00`),
        status: 'SCHEDULED',
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
