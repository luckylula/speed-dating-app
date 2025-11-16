import { NextResponse } from "next/server"
import { calcularMatchesEvento } from "@/lib/matching/algoritmo"

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // IMPORTANTE: En Next.js 16, params es una Promise
    const params = await context.params
    const eventoId = params.id
    
    console.log(`🚀 Iniciando cálculo de matches para evento: ${eventoId}`)
    
    const resultado = await calcularMatchesEvento(eventoId)
    
    if (!resultado.success) {
      return NextResponse.json(
        { error: resultado.error },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      {
        message: "Matches calculados exitosamente",
        ...resultado
      },
      { status: 200 }
    )
    
  } catch (error) {
    console.error("Error en endpoint de matches:", error)
    return NextResponse.json(
      { error: "Error al calcular matches" },
      { status: 500 }
    )
  }
}