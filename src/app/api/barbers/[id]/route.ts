import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// PUT /api/barbers/[id] - Update barber
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth()
    if (!session) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    try {
        const { id } = await params
        const body = await request.json()
        const { name, commissionType, commissionValue, active } = body

        const barber = await prisma.barber.update({
            where: { id },
            data: {
                ...(name !== undefined && { name }),
                ...(commissionType !== undefined && { commissionType }),
                ...(commissionValue !== undefined && { commissionValue }),
                ...(active !== undefined && { active }),
            }
        })

        return NextResponse.json(barber)
    } catch (error) {
        console.error("Error updating barber:", error)
        return NextResponse.json({ error: "Error al actualizar peluquero" }, { status: 500 })
    }
}

// DELETE /api/barbers/[id] - Delete barber
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth()
    if (!session) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    try {
        const { id } = await params
        await prisma.barber.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Error al eliminar peluquero" }, { status: 500 })
    }
}
