import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const participantes = await prisma.participante.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(participantes)
  } catch (error) {
    console.error("Error obteniendo participantes:", error)
    return NextResponse.json(
      { error: "Error al obtener participantes" },
      { status: 500 }
    )
  }
}