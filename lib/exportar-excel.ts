import * as XLSX from 'xlsx'

export function exportarMatchesAExcel(matches: any[], nombreEvento: string) {
  // Preparar datos para Excel
  const datos = matches.map(match => ({
    'Participante A': `${match.participanteA.nombre} ${match.participanteA.apellidos}`,
    'Edad A': match.participanteA.edad,
    'Género A': match.participanteA.genero,
    'Participante B': `${match.participanteB.nombre} ${match.participanteB.apellidos}`,
    'Edad B': match.participanteB.edad,
    'Género B': match.participanteB.genero,
    'Compatibilidad Total': `${match.porcentajeTotal}%`,
    'Estilo de Vida': `${match.estiloVida}%`,
    'Objetivos': `${match.objetivos}%`,
    'Física/Sexual': `${match.fisica}%`,
    'Intelectual': `${match.intelectual}%`,
    'Sin Descartes': `${match.descarte}%`,
    'Evento': match.evento.nombre
  }))

  // Crear libro de Excel
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(datos)

  // Ajustar ancho de columnas
  const wscols = [
    { wch: 25 }, // Participante A
    { wch: 8 },  // Edad A
    { wch: 10 }, // Género A
    { wch: 25 }, // Participante B
    { wch: 8 },  // Edad B
    { wch: 10 }, // Género B
    { wch: 18 }, // Compatibilidad
    { wch: 15 }, // Estilo
    { wch: 12 }, // Objetivos
    { wch: 15 }, // Física
    { wch: 13 }, // Intelectual
    { wch: 13 }, // Descartes
    { wch: 30 }  // Evento
  ]
  ws['!cols'] = wscols

  XLSX.utils.book_append_sheet(wb, ws, "Matches")

  // Descargar archivo
  const nombreArchivo = `matches_${nombreEvento.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`
  XLSX.writeFile(wb, nombreArchivo)
}

export function exportarParticipantesAExcel(participantes: any[]) {
  const datos = participantes.map(p => ({
    'Nombre': p.nombre,
    'Apellidos': p.apellidos,
    'Edad': p.edad,
    'Género': p.genero,
    'Email': p.email,
    'Teléfono': p.telefono || 'N/A',
    'Residencia': p.residencia || 'N/A',
    'Fecha de Registro': new Date(p.createdAt).toLocaleDateString('es-ES')
  }))

  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(datos)

  const wscols = [
    { wch: 15 },
    { wch: 20 },
    { wch: 8 },
    { wch: 10 },
    { wch: 30 },
    { wch: 15 },
    { wch: 20 },
    { wch: 15 }
  ]
  ws['!cols'] = wscols

  XLSX.utils.book_append_sheet(wb, ws, "Participantes")

  const nombreArchivo = `participantes_${new Date().toISOString().split('T')[0]}.xlsx`
  XLSX.writeFile(wb, nombreArchivo)
}