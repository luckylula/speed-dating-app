import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const eventoId = params.id
    const body = await request.json()
    const { estado } = body

    const evento = await prisma.evento.update({
      where: { id: eventoId },
      data: { estado }
    })

    return NextResponse.json(evento)
  } catch (error) {
    console.error("Error actualizando evento:", error)
    return NextResponse.json(
      { error: "Error al actualizar evento" },
      { status: 500 }
    )
  }
}