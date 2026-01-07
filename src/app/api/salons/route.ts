import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    // Permitir acceso público a peluquerías
    // const session = await auth()
    // if (!session?.user?.salonId) {
    //   return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    // }

    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search") || ""

    const where: Prisma.SalonWhereInput = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ]
    }

    const salons = await prisma.salon.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ data: salons })
  } catch (error) {
    console.error("Error fetching salons:", error)
    return NextResponse.json(
      { error: "Error al obtener peluquerías" },
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
    const { name, address, phone } = data

    if (!name) {
      return NextResponse.json(
        { error: "El nombre es requerido" },
        { status: 400 }
      )
    }

    const salon = await prisma.salon.create({
      data: {
        name,
        address: address || null,
        phone: phone || null,
      },
    })

    return NextResponse.json(salon, { status: 201 })
  } catch (error) {
    console.error("Error creating salon:", error)
    return NextResponse.json(
      { error: "Error al crear peluquería" },
      { status: 500 }
    )
  }
}
