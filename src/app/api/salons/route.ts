import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    // Retornamos un salón por defecto ya que el modelo fue removido/simplificado
    const salons = [
      {
        id: "default-salon",
        name: "Elvis Barber Studio",
        address: "Av. Principal 123",
        phone: "+54 9 11 1234-5678",
        createdAt: new Date().toISOString(),
      }
    ]

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

    // Mock de creación ya que no existe el modelo Salon
    const salon = {
      id: "new-salon-id",
      name,
      address: address || null,
      phone: phone || null,
      createdAt: new Date().toISOString()
    }
    // const salon = await prisma.salon.create({
    //   data: {
    //     name,
    //     address: address || null,
    //     phone: phone || null,
    //   },
    // })

    return NextResponse.json(salon, { status: 201 })
  } catch (error) {
    console.error("Error creating salon:", error)
    return NextResponse.json(
      { error: "Error al crear peluquería" },
      { status: 500 }
    )
  }
}
