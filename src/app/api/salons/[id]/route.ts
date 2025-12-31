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
    const { name, address, phone } = data

    const salon = await prisma.salon.update({
      where: { id },
      data: {
        name: name !== undefined ? name : undefined,
        address: address !== undefined ? address : undefined,
        phone: phone !== undefined ? phone : undefined,
      },
    })

    return NextResponse.json(salon)
  } catch (error) {
    console.error("Error updating salon:", error)
    return NextResponse.json(
      { error: "Error al actualizar peluquería" },
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

    await prisma.salon.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting salon:", error)
    return NextResponse.json(
      { error: "Error al eliminar peluquería" },
      { status: 500 }
    )
  }
}
