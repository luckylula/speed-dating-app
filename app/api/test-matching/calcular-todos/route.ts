import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Función para calcular compatibilidad entre dos participantes
function calcularCompatibilidad(respA: any, respB: any) {
  let estiloVida = 0
  let objetivos = 0
  let fisica = 0
  let intelectual = 0
  let descarte = 0

  // Estilo de Vida (20 puntos)
  const coincidenciasEstilo = [
    respA.gruposIdentificacion?.some((g: string) => respB.gruposIdentificacion?.includes(g)),
    respA.deportes?.some((d: string) => respB.deportes?.includes(d)),
    respA.fumador === respB.fumador,
    respA.formaVestir?.some((f: string) => respB.formaVestir?.includes(f)),
    respA.tipoCasa?.some((t: string) => respB.tipoCasa?.includes(t))
  ]
  estiloVida = (coincidenciasEstilo.filter(Boolean).length / 5) * 100

  // Objetivos (20 puntos)
  const coincidenciasObjetivos = [
    respA.queBuscas?.some((q: string) => respB.queBuscas?.includes(q)),
    respA.hijos?.some((h: string) => respB.hijos?.includes(h)),
    respA.valores?.some((v: string) => respB.valores?.includes(v)),
    respA.visionFuturo?.some((vf: string) => respB.visionFuturo?.includes(vf))
  ]
  objetivos = (coincidenciasObjetivos.filter(Boolean).length / 4) * 100

  // Física/Sexual (20 puntos)
  const coincidenciasFisica = [
    respA.atraccionFisica?.some((af: string) => respB.atraccionFisica?.includes(af)),
    respA.importanciaSexo === respB.importanciaSexo,
    respA.queValoras?.some((qv: string) => respB.queValoras?.includes(qv))
  ]
  fisica = (coincidenciasFisica.filter(Boolean).length / 3) * 100

  // Intelectual/Cultural (20 puntos)
  const coincidenciasIntelectual = [
    respA.formacion?.some((f: string) => respB.formacion?.includes(f)),
    respA.idiomas?.some((i: string) => respB.idiomas?.includes(i)),
    respA.visionVida === respB.visionVida
  ]
  intelectual = (coincidenciasIntelectual.filter(Boolean).length / 3) * 100

  // Factores de Descarte (20 puntos)
  const factoresDescarte = [
    respA.opinionDrogas === respB.opinionDrogas,
    respA.opinionAlcohol === respB.opinionAlcohol,
    respA.suenos?.some((s: string) => respB.suenos?.includes(s))
  ]
  descarte = (factoresDescarte.filter(Boolean).length / 3) * 100

  const porcentajeTotal = Math.round(
    (estiloVida + objetivos + fisica + intelectual + descarte) / 5
  )

  return {
    porcentajeTotal,
    estiloVida: Math.round(estiloVida),
    objetivos: Math.round(objetivos),
    fisica: Math.round(fisica),
    intelectual: Math.round(intelectual),
    descarte: Math.round(descarte)
  }
}

export async function POST() {
  try {
    // Obtener todos los participantes con sus respuestas
    const participantes = await prisma.participante.findMany({
  include: {
    respuesta: true
  }
})

    if (participantes.length < 2) {
      return NextResponse.json(
        { error: "Se necesitan al menos 2 participantes" },
        { status: 400 }
      )
    }

    const matches = []
    let totalCompatibilidad = 0

    // Calcular matches entre todos los pares
    for (let i = 0; i < participantes.length; i++) {
      for (let j = i + 1; j < participantes.length; j++) {
        const partA = participantes[i]
        const partB = participantes[j]

       if (!partA.respuesta || !partB.respuesta) continue

      const compatibilidad = calcularCompatibilidad(
        partA.respuesta,
        partB.respuesta
      )

        totalCompatibilidad += compatibilidad.porcentajeTotal

        // Crear el match en la base de datos
        const match = await prisma.match.create({
          data: {
            eventoId: "test-event",
            participanteAId: partA.id,
            participanteBId: partB.id,
            porcentajeTotal: compatibilidad.porcentajeTotal,
            estiloVida: compatibilidad.estiloVida,
            objetivos: compatibilidad.objetivos,
            fisica: compatibilidad.fisica,
            intelectual: compatibilidad.intelectual,
            descarte: compatibilidad.descarte,
            estado: "test"
          },
          include: {
            participanteA: {
              select: {
                nombre: true,
                apellidos: true
              }
            },
            participanteB: {
              select: {
                nombre: true,
                apellidos: true
              }
            }
          }
        })

        matches.push(match)
      }
    }

    const promedioCompatibilidad = matches.length > 0
      ? Math.round(totalCompatibilidad / matches.length)
      : 0

    return NextResponse.json({
      success: true,
      totalMatches: matches.length,
      totalParticipantes: participantes.length,
      promedioCompatibilidad,
      matches
    })
  } catch (error: any) {
    console.error("Error calculando matches:", error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
