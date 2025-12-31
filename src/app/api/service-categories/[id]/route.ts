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
    const { name } = data

    const category = await (prisma as any).serviceCategory.update({
      where: { id },
      data: { name },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json(
      { error: "Error al actualizar categoría" },
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

    await (prisma as any).serviceCategory.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json(
      { error: "Error al eliminar categoría" },
      { status: 500 }
    )
  }
}
