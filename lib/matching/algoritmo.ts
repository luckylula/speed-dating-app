import { prisma } from "@/lib/prisma"

interface MatchResult {
  participanteAId: string
  participanteBId: string
  porcentajeTotal: number
  estiloVida: number
  objetivos: number
  fisica: number
  intelectual: number
  descarte: number
}

// Verificar compatibilidad de edad
function edadEnRango(edad: number, rangosAceptables: string[]): boolean {
  for (const rango of rangosAceptables) {
    switch(rango) {
      case "DE 18 A 25 AÑOS":
        if (edad >= 18 && edad <= 25) return true
        break
      case "DE 25 A 30 AÑOS":
        if (edad >= 25 && edad <= 30) return true
        break
      case "DE 30 A 40 AÑOS":
        if (edad >= 30 && edad <= 40) return true
        break
      case "DE 40 A 50 AÑOS":
        if (edad >= 40 && edad <= 50) return true
        break
      case "DE 50 A 65 AÑOS":
        if (edad >= 50 && edad <= 65) return true
        break
      case "DE 65 AÑOS A 100 AÑOS":
        if (edad >= 65 && edad <= 100) return true
        break
    }
  }
  return false
}

// Verificar compatibilidad sexual
function sexualidadCompatible(
  sexA: string, 
  sexB: string, 
  generoA: string, 
  generoB: string
): boolean {
  if (sexA === "BISEXUAL" || sexB === "BISEXUAL") return true
  if (sexA === "HETEROSEXUAL" && sexB === "HETEROSEXUAL") return generoA !== generoB
  if (sexA === "HOMOSEXUAL" && sexB === "HOMOSEXUAL") return generoA === generoB
  return false
}

// Verificar filtros obligatorios
function verificarCompatibilidadBasica(
  participanteA: any,
  participanteB: any,
  respuestasA: any,
  respuestasB: any
): boolean {
  if (!edadEnRango(participanteA.edad, respuestasB.franjaEdad) ||
      !edadEnRango(participanteB.edad, respuestasA.franjaEdad)) {
    return false
  }
  
  if (!sexualidadCompatible(
    respuestasA.sexualidad,
    respuestasB.sexualidad,
    participanteA.genero,
    participanteB.genero
  )) {
    return false
  }
  
  return true
}

// Calcular coincidencias en arrays
function calcularCoincidencias(arrayA: string[], arrayB: string[]): number {
  if (!arrayA || !arrayB || arrayA.length === 0 || arrayB.length === 0) {
    return 0
  }
  
  const coincidencias = arrayA.filter(item => arrayB.includes(item)).length
  const maxPosibles = Math.max(arrayA.length, arrayB.length)
  
  return (coincidencias / maxPosibles) * 100
}

// Calcular compatibilidad de Estilo de Vida (25%)
function calcularEstiloVida(respA: any, respB: any): number {
  let puntos = 0
  
  const coincidenciasGrupos = calcularCoincidencias(
    respA.gruposIdentificacion,
    respB.gruposIdentificacion
  )
  puntos += (coincidenciasGrupos / 100) * 40
  
  const factoresDescarteA = respA.factoresDescarte || []
  const factoresDescarteB = respB.factoresDescarte || []
  
  if (respA.fumador === "FUMADOR/A" && factoresDescarteB.includes("FUMADOR/A")) {
    puntos -= 30
  } else if (respB.fumador === "FUMADOR/A" && factoresDescarteA.includes("FUMADOR/A")) {
    puntos -= 30
  } else if (respA.fumador === respB.fumador) {
    puntos += 30
  } else {
    puntos += 15
  }
  
  const coincidenciasVestir = calcularCoincidencias(respA.formaVestir, respB.formaVestir)
  puntos += (coincidenciasVestir / 100) * 15
  
  const coincidenciasCasa = calcularCoincidencias(respA.tipoCasa, respB.tipoCasa)
  puntos += (coincidenciasCasa / 100) * 15
  
  return Math.max(0, Math.min(100, puntos))
}

// Calcular compatibilidad de Objetivos Relacionales (30%)
function calcularObjetivos(respA: any, respB: any): number {
  let puntos = 0
  
  const coincidenciasBusca = calcularCoincidencias(respA.queBuscas, respB.queBuscas)
  puntos += (coincidenciasBusca / 100) * 40
  
  const hijosA = respA.hijos || []
  const hijosB = respB.hijos || []
  
  if ((hijosA.includes("SI") && hijosB.includes("NO QUIERO! ESTOY GENIAL ASI!")) ||
      (hijosB.includes("SI") && hijosA.includes("NO QUIERO! ESTOY GENIAL ASI!"))) {
    puntos -= 25
  } else {
    const coincidenciasHijos = calcularCoincidencias(hijosA, hijosB)
    puntos += (coincidenciasHijos / 100) * 25
  }
  
  const coincidenciasValores = calcularCoincidencias(respA.valores, respB.valores)
  puntos += (coincidenciasValores / 100) * 20
  
  const coincidenciasFuturo = calcularCoincidencias(respA.visionFuturo, respB.visionFuturo)
  puntos += (coincidenciasFuturo / 100) * 15
  
  return Math.max(0, Math.min(100, puntos))
}

// Calcular compatibilidad Física/Sexual (20%)
function calcularFisica(respA: any, respB: any): number {
  let puntos = 0
  
  const coincidenciasAtraccion = calcularCoincidencias(respA.atraccionFisica, respB.atraccionFisica)
  puntos += (coincidenciasAtraccion / 100) * 40
  
  const coincidenciasSexo = calcularCoincidencias(respA.importanciaSexo, respB.importanciaSexo)
  puntos += (coincidenciasSexo / 100) * 35
  
  const coincidenciasValora = calcularCoincidencias(respA.queValoras, respB.queValoras)
  puntos += (coincidenciasValora / 100) * 25
  
  return Math.max(0, Math.min(100, puntos))
}
// Calcular compatibilidad Intelectual/Cultural (15%)
function calcularIntelectual(respA: any, respB: any): number {
  let puntos = 0
  
  const coincidenciasFormacion = calcularCoincidencias(respA.formacion, respB.formacion)
  puntos += (coincidenciasFormacion / 100) * 30
  
  const coincidenciasIdiomas = calcularCoincidencias(respA.idiomas, respB.idiomas)
  puntos += (coincidenciasIdiomas / 100) * 30
  
  if (respA.visionVida === respB.visionVida) {
    puntos += 20
  }
  
  const coincidenciasSuenos = calcularCoincidencias(respA.suenos, respB.suenos)
  puntos += (coincidenciasSuenos / 100) * 20
  
  return Math.max(0, Math.min(100, puntos))
}

// Aplicar factores de descarte (10%)
function calcularDescarte(respA: any, respB: any, participanteA: any, participanteB: any): number {
  let puntos = 100
  
  const factoresDescarteA = respA.factoresDescarte || []
  const factoresDescarteB = respB.factoresDescarte || []
  
  if (factoresDescarteA.includes("CELOS") || factoresDescarteB.includes("CELOS")) {
    puntos -= 10
  }
  
  if (respA.fumador === "FUMADOR/A" && factoresDescarteB.includes("FUMADOR/A")) {
    puntos -= 40
  }
  
  if (respB.fumador === "FUMADOR/A" && factoresDescarteA.includes("FUMADOR/A")) {
    puntos -= 40
  }
  
  if (factoresDescarteA.includes("INFIDELIDAD") || factoresDescarteB.includes("INFIDELIDAD")) {
    puntos -= 5
  }
  
  const hijosA = respA.hijos || []
  const hijosB = respB.hijos || []
  
  if (hijosA.includes("SI") && factoresDescarteB.includes("TENER HIJOS O CARGAS FAMILIARES")) {
    puntos -= 50
  }
  
  if (hijosB.includes("SI") && factoresDescarteA.includes("TENER HIJOS O CARGAS FAMILIARES")) {
    puntos -= 50
  }
  
  return Math.max(0, puntos)
}

// Función principal para calcular matches de un evento
export async function calcularMatchesEvento(eventoId: string) {
  try {
    console.log(`🔄 Calculando matches para evento: ${eventoId}`)
    
    const inscripciones = await prisma.eventoParticipante.findMany({
      where: { eventoId },
      include: {
        participante: {
          include: {
            respuestas: true
          }
        }
      }
    })
    
    const participantes = inscripciones.map(i => ({
      ...i.participante,
      respuestas: i.participante.respuestas
    }))
    
    console.log(`👥 Total participantes: ${participantes.length}`)
    
    if (participantes.length < 2) {
      return {
        success: false,
        error: "Se necesitan al menos 2 participantes para generar matches"
      }
    }
    
    await prisma.match.deleteMany({
      where: { eventoId }
    })
    
    const matchesGenerados: MatchResult[] = []
    
    for (let i = 0; i < participantes.length; i++) {
      for (let j = i + 1; j < participantes.length; j++) {
        const participanteA = participantes[i]
        const participanteB = participantes[j]
        const respuestasA = participanteA.respuestas
        const respuestasB = participanteB.respuestas
        
        if (!respuestasA || !respuestasB) continue
        
        if (!verificarCompatibilidadBasica(participanteA, participanteB, respuestasA, respuestasB)) {
          console.log(`❌ ${participanteA.nombre} y ${participanteB.nombre}: No compatibles`)
          continue
        }
        
        const estiloVida = calcularEstiloVida(respuestasA, respuestasB)
        const objetivos = calcularObjetivos(respuestasA, respuestasB)
        const fisica = calcularFisica(respuestasA, respuestasB)
        const intelectual = calcularIntelectual(respuestasA, respuestasB)
        const descarte = calcularDescarte(respuestasA, respuestasB, participanteA, participanteB)
        
        const porcentajeTotal = Math.round(
          (estiloVida * 0.25) +
          (objetivos * 0.30) +
          (fisica * 0.20) +
          (intelectual * 0.15) +
          (descarte * 0.10)
        )
        
        if (porcentajeTotal >= 30) {
          matchesGenerados.push({
            participanteAId: participanteA.id,
            participanteBId: participanteB.id,
            porcentajeTotal,
            estiloVida: Math.round(estiloVida),
            objetivos: Math.round(objetivos),
            fisica: Math.round(fisica),
            intelectual: Math.round(intelectual),
            descarte: Math.round(descarte)
          })
          
          console.log(`✅ ${participanteA.nombre} y ${participanteB.nombre}: ${porcentajeTotal}%`)
        }
      }
    }
    
    if (matchesGenerados.length > 0) {
      await prisma.match.createMany({
        data: matchesGenerados.map(m => ({
          ...m,
          eventoId,
          estado: "pendiente"
        }))
      })
    }
    
    console.log(`\n🎉 Total matches generados: ${matchesGenerados.length}`)
    
    return {
      success: true,
      totalMatches: matchesGenerados.length,
      totalParticipantes: participantes.length,
      promedioCompatibilidad: matchesGenerados.length > 0 
        ? Math.round(matchesGenerados.reduce((acc, m) => acc + m.porcentajeTotal, 0) / matchesGenerados.length)
        : 0
    }
    
  } catch (error) {
    console.error("❌ Error calculando matches:", error)
    return {
      success: false,
      error: "Error al calcular matches"
    }
  }
}