import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const matches = await prisma.match.findMany({
      include: {
        participanteA: true,
        participanteB: true,
        evento: true
      },
      orderBy: {
        porcentajeTotal: 'desc'
      }
    })

    return NextResponse.json(matches)
  } catch (error) {
    console.error("Error obteniendo matches:", error)
    return NextResponse.json(
      { error: "Error al obtener matches" },
      { status: 500 }
    )
  }
}