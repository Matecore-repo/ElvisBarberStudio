import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = await params
    const data = await request.json()
    const { active, commissionType, commissionValue, name } = data

    const barber = await prisma.barber.update({
      where: { id },
      data: {
        active: active !== undefined ? active : undefined,
        name: name !== undefined ? name : undefined,
        commissionType: commissionType !== undefined ? commissionType : undefined,
        commissionValue: commissionValue !== undefined ? commissionValue : undefined,
      },
    })

    return NextResponse.json(barber)
  } catch (error) {
    console.error("Error updating barber:", error)
    return NextResponse.json(
      { error: "Error al actualizar peluquero" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = await params

    await prisma.barber.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting barber:", error)
    return NextResponse.json(
      { error: "Error al eliminar peluquero" },
      { status: 500 }
    )
  }
}
