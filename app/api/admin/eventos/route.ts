import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const eventos = await prisma.evento.findMany({
      include: {
        _count: {
          select: { participantes: true }
        }
      },
      orderBy: {
        fecha: 'desc'
      }
    })

    return NextResponse.json(eventos)
  } catch (error) {
    console.error("Error obteniendo eventos:", error)
    return NextResponse.json(
      { error: "Error al obtener eventos" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nombre, descripcion, fecha, lugar, maxParticipantes } = body

    if (!nombre || !fecha || !lugar) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      )
    }

    const evento = await prisma.evento.create({
      data: {
        nombre,
        descripcion: descripcion || "",
        fecha: new Date(fecha),
        lugar,
        maxParticipantes: maxParticipantes || 50,
        estado: "activo"
      }
    })

    return NextResponse.json(evento, { status: 201 })
  } catch (error) {
    console.error("Error creando evento:", error)
    return NextResponse.json(
      { error: "Error al crear evento" },
      { status: 500 }
    )
  }
}