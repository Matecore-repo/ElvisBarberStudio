import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const staff = await prisma.staff.findMany({
      select: {
        id: true,
        name: true,
        active: true,
        commissionRateDefault: true,
      },
    });
    return NextResponse.json(staff);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching staff' }, { status: 500 });
  }
}
