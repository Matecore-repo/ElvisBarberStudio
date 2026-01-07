import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const services = [
      { id: '1', name: 'Corte Clásico', price: 100, description: 'Corte de cabello clásico' },
      { id: '2', name: 'Corte Degradado', price: 120, description: 'Corte degradado moderno' },
      { id: '3', name: 'Afeitado Clásico', price: 80, description: 'Afeitado tradicional con navaja' },
      { id: '4', name: 'Corte + Barba', price: 150, description: 'Corte de cabello y afeitado de barba' },
      { id: '5', name: 'Tinte', price: 200, description: 'Servicio de tinte capilar' },
    ];
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching services' }, { status: 500 });
  }
}
