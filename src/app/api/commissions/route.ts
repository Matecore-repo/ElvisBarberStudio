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
    const barberId = searchParams.get("barberId")

    const skip = (page - 1) * limit
    const where: any = {}

    if (status && status !== "all") {
      where.status = status
    }
    if (barberId) {
      where.barberId = parseInt(barberId)
    }

    const [commissions, total] = await Promise.all([
      prisma.commission.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          barber: true,
          appointment: true,
        },
      }),
      prisma.commission.count({ where }),
    ])

    return NextResponse.json({
      data: commissions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching commissions:", error)
    return NextResponse.json(
      { error: "Error al obtener comisiones" },
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
    const { barberId, appointmentId, amount, status } = data

    if (!barberId || !amount) {
      return NextResponse.json(
        { error: "Peluquero y monto son requeridos" },
        { status: 400 }
      )
    }

    const commission = await prisma.commission.create({
      data: {
        barberId,
        appointmentId: appointmentId || null,
        amount: parseFloat(amount),
        status: status || "PENDING",
      },
      include: {
        barber: true,
      },
    })

    return NextResponse.json(commission, { status: 201 })
  } catch (error) {
    console.error("Error creating commission:", error)
    return NextResponse.json(
      { error: "Error al crear comisión" },
      { status: 500 }
    )
  }
}
