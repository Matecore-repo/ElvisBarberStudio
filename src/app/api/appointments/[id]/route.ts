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

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        client: true,
        barber: true,
      },
    })

    if (!appointment) {
      return NextResponse.json(
        { error: "Turno no encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(appointment)
  } catch (error) {
    console.error("Error fetching appointment:", error)
    return NextResponse.json(
      { error: "Error al obtener turno" },
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
    const { date, time, service, status } = data

    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        ...(date && { scheduledStart: new Date(date) }),
        ...(time && { time }),
        ...(service && { service }),
        ...(status && { status }),
      },
      include: {
        client: true,
        barber: true,
      },
    })

    return NextResponse.json(appointment)
  } catch (error) {
    console.error("Error updating appointment:", error)
    return NextResponse.json(
      { error: "Error al actualizar turno" },
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

    await prisma.appointment.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Turno eliminado" })
  } catch (error) {
    console.error("Error deleting appointment:", error)
    return NextResponse.json(
      { error: "Error al eliminar turno" },
      { status: 500 }
    )
  }
}
