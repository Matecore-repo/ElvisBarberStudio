import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// POST /api/commissions/[id]/pay - Mark commission as paid
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth()
    if (!session) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Optional: Check for OWNER or MANAGER role
    if (session.user.role === "STAFF") {
        return NextResponse.json({ error: "Sin permisos para pagar comisiones" }, { status: 403 })
    }

    try {
        const { id } = await params

        const commission = await prisma.commission.findUnique({
            where: { id }
        })

        if (!commission) {
            return NextResponse.json({ error: "Comisión no encontrada" }, { status: 404 })
        }

        if (commission.status === "PAID") {
            return NextResponse.json({ error: "Comisión ya pagada" }, { status: 400 })
        }

        const updated = await prisma.commission.update({
            where: { id },
            data: {
                status: "PAID",
                paidAt: new Date(),
            }
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error("Error paying commission:", error)
        return NextResponse.json({ error: "Error al pagar comisión" }, { status: 500 })
    }
}
