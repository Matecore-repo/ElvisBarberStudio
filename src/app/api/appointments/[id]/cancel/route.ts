import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const sale = await prisma.sale.update({
            where: { id },
            data: { status: 'CANCELED' },
        });
        return NextResponse.json(sale);
    } catch (error) {
        return NextResponse.json(
            { error: 'Error cancelling appointment' },
            { status: 500 }
        );
    }
}
