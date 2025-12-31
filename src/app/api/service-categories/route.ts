import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search") || ""

    const where: Prisma.ServiceCategoryWhereInput = {}

    if (search) {
      where.name = { contains: search, mode: "insensitive" }
    }

    const categories = await (prisma as any).serviceCategory.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ data: categories })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { error: "Error al obtener categorías" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { name, salonId } = data

    if (!name || !salonId) {
      return NextResponse.json(
        { error: "El nombre y salonId son requeridos" },
        { status: 400 }
      )
    }

    const category = await (prisma as any).serviceCategory.create({
      data: {
        salonId,
        name,
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json(
      { error: "Error al crear categoría" },
      { status: 500 }
    )
  }
}
