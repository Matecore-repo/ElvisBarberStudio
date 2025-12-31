import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.salonId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const active = searchParams.get("active")

    const skip = (page - 1) * limit
    const where: Prisma.BarberWhereInput = {
      salonId: session.user.salonId
    }

    if (search) {
      where.name = { contains: search, mode: "insensitive" }
    }
    if (active !== null && active !== undefined) {
      where.active = active === "true"
    }

    const [barbers, total] = await Promise.all([
      prisma.barber.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.barber.count({ where }),
    ])

    return NextResponse.json({
      data: barbers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching barbers:", error)
    return NextResponse.json(
      { error: "Error al obtener peluqueros" },
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
    const { name, commissionType, commissionValue, active } = data

    if (!name) {
      return NextResponse.json(
        { error: "El nombre es requerido" },
        { status: 400 }
      )
    }

    const barber = await prisma.barber.create({
      data: {
        salonId: session.user.salonId as string,
        name,
        commissionType: commissionType || "PERCENT",
        commissionValue: commissionValue || 0,
        active: active !== false,
      },
    })

    return NextResponse.json(barber, { status: 201 })
  } catch (error) {
    console.error("Error creating barber:", error)
    return NextResponse.json(
      { error: "Error al crear peluquero" },
      { status: 500 }
    )
  }
}
