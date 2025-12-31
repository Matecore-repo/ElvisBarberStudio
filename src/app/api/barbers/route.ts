import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// GET /api/barbers - List barbers
export async function GET() {
    const session = await auth()
    if (!session) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    try {
        const barbers = await prisma.barber.findMany({
            orderBy: { createdAt: "desc" }
        })
        return NextResponse.json(barbers)
    } catch (error) {
        return NextResponse.json({ error: "Error al obtener peluqueros" }, { status: 500 })
    }
}

// POST /api/barbers - Create barber
export async function POST(request: Request) {
    const session = await auth()
    if (!session) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { name, commissionType, commissionValue, salonId } = body

        if (!name) {
            return NextResponse.json({ error: "Nombre requerido" }, { status: 400 })
        }

        const barber = await prisma.barber.create({
            data: {
                name,
                commissionType: commissionType || "PERCENT",
                commissionValue: commissionValue || 0,
                salonId: salonId || session.user.salonId || "default-salon",
            }
        })

        return NextResponse.json(barber, { status: 201 })
    } catch (error) {
        console.error("Error creating barber:", error)
        return NextResponse.json({ error: "Error al crear peluquero" }, { status: 500 })
    }
}
