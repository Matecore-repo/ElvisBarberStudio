import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = await props.params

    const commission = await prisma.commission.findUnique({
      where: { id },
      include: {
        barber: true,
        appointment: true,
      },
    })

    if (!commission) {
      return NextResponse.json(
        { error: "Comisión no encontrada" },
        { status: 404 }
      )
    }

    return NextResponse.json(commission)
  } catch (error) {
    console.error("Error fetching commission:", error)
    return NextResponse.json(
      { error: "Error al obtener comisión" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = await props.params
    const data = await request.json()
    const { amount, status } = data

    const commission = await prisma.commission.update({
      where: { id },
      data: {
        ...(amount && { amount }),
        ...(status && { status }),
      },
      include: {
        barber: true,
      },
    })

    return NextResponse.json(commission)
  } catch (error) {
    console.error("Error updating commission:", error)
    return NextResponse.json(
      { error: "Error al actualizar comisión" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = await props.params

    await prisma.commission.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Comisión eliminada" })
  } catch (error) {
    console.error("Error deleting commission:", error)
    return NextResponse.json(
      { error: "Error al eliminar comisión" },
      { status: 500 }
    )
  }
}
