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
    const { name, categoryId, price, durationMinutes } = data

    const service = await prisma.service.update({
      where: { id },
      data: {
        name: name !== undefined ? name : undefined,
        categoryId: categoryId !== undefined ? categoryId : undefined,
        price: price !== undefined ? price : undefined,
        durationMinutes: durationMinutes !== undefined ? durationMinutes : undefined,
      },
      include: { category: true },
    })

    return NextResponse.json(service)
  } catch (error) {
    console.error("Error updating service:", error)
    return NextResponse.json(
      { error: "Error al actualizar servicio" },
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

    await prisma.service.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting service:", error)
    return NextResponse.json(
      { error: "Error al eliminar servicio" },
      { status: 500 }
    )
  }
}
