import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const participanteId = params.id

    const participante = await prisma.participante.findUnique({
      where: { id: participanteId },
      include: {
        user: {
          select: {
            email: true,
            createdAt: true
          }
        },
        eventosInscritos: {
          include: {
            evento: {
              select: {
                nombre: true,
                fecha: true
              }
            }
          }
        },
        respuestas: true  // ← AGREGAR ESTA LÍNEA
      }
    })

    if (!participante) {
      return NextResponse.json(
        { error: "Participante no encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(participante)
  } catch (error) {
    console.error("Error obteniendo participante:", error)
    return NextResponse.json(
      { error: "Error al obtener participante" },
      { status: 500 }
    )
  }
}