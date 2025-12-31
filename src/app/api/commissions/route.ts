import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// GET /api/commissions - List commissions
export async function GET(request: Request) {
    const session = await auth()
    if (!session) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    try {
        const { searchParams } = new URL(request.url)
        const status = searchParams.get("status")

        const commissions = await prisma.commission.findMany({
            where: status ? { status: status as "PENDING" | "PAID" } : undefined,
            include: {
                barber: true,
                appointment: {
                    include: {
                        client: true,
                        service: true,
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        })

        return NextResponse.json(commissions)
    } catch (error) {
        return NextResponse.json({ error: "Error al obtener comisiones" }, { status: 500 })
    }
}
