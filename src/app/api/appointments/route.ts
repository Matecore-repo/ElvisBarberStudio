import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")

    const skip = (page - 1) * limit
    const where: any = {}

    if (status && status !== "all") {
      where.status = status
    }

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          client: true,
          barber: true,
        },
      }),
      prisma.appointment.count({ where }),
    ])

    return NextResponse.json({
      data: appointments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return NextResponse.json(
      { error: "Error al obtener turnos" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const data = await request.json()
    const { clientId, barberId, date, time, service, status } = data

    if (!clientId || !barberId || !date || !time) {
      return NextResponse.json(
        { error: "Datos requeridos faltantes" },
        { status: 400 }
      )
    }

    const appointment = await prisma.appointment.create({
      data: {
        clientId,
        barberId,
        date: new Date(date),
        time,
        service: service || "Corte",
        status: status || "SCHEDULED",
      },
      include: {
        client: true,
        barber: true,
      },
    })

    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    console.error("Error creating appointment:", error)
    return NextResponse.json(
      { error: "Error al crear turno" },
      { status: 500 }
    )
  }
}
