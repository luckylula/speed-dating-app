import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const [totalParticipantes, totalEventos, totalMatches] = await Promise.all([
      prisma.participante.count(),
      prisma.evento.count(),
      prisma.match.count()
    ])

    return NextResponse.json({
      totalParticipantes,
      totalEventos,
      totalMatches
    })
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error)
    return NextResponse.json(
      { error: "Error al obtener estadísticas" },
      { status: 500 }
    )
  }
}