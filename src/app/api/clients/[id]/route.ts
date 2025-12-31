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
    const { name, phone, notes } = data

    const client = await prisma.client.update({
      where: { id },
      data: {
        name: name !== undefined ? name : undefined,
        phone: phone !== undefined ? phone : undefined,
        notes: notes !== undefined ? notes : undefined,
      },
    })

    return NextResponse.json(client)
  } catch (error) {
    console.error("Error updating client:", error)
    return NextResponse.json(
      { error: "Error al actualizar cliente" },
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

    await prisma.client.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting client:", error)
    return NextResponse.json(
      { error: "Error al eliminar cliente" },
      { status: 500 }
    )
  }
}
