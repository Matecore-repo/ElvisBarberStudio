import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "100")
    const search = searchParams.get("search") || ""
    const categoryId = searchParams.get("categoryId")

    const skip = (page - 1) * limit
    const where: Prisma.ServiceWhereInput = {}

    if (search) {
      where.name = { contains: search, mode: "insensitive" }
    }
    if (categoryId) {
      where.categoryId = categoryId
    }

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        include: { category: true },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.service.count({ where }),
    ])

    return NextResponse.json({
      data: services,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json(
      { error: "Error al obtener servicios" },
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
    const { name, categoryId, price, durationMinutes } = data

    if (!name || price === undefined) {
      return NextResponse.json(
        { error: "El nombre y precio son requeridos" },
        { status: 400 }
      )
    }

    const service = await prisma.service.create({
      data: {
        salonId: session.user.salonId as string,
        name,
        categoryId: categoryId || null,
        price,
        durationMinutes: durationMinutes || 30,
      },
      include: { category: true },
    })

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error("Error creating service:", error)
    return NextResponse.json(
      { error: "Error al crear servicio" },
      { status: 500 }
    )
  }
}
