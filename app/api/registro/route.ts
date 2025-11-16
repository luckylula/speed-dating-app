import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validar campos obligatorios
    if (!body.nombre || !body.apellidos || !body.edad || !body.genero || !body.email) {
      return NextResponse.json(
        { error: "Faltan datos personales obligatorios" },
        { status: 400 }
      )
    }

    if (!body.franjaEdad || body.franjaEdad.length === 0) {
      return NextResponse.json(
        { error: "Debes seleccionar al menos una franja de edad" },
        { status: 400 }
      )
    }

    if (!body.sexualidad) {
      return NextResponse.json(
        { error: "Debes indicar tu orientación sexual" },
        { status: 400 }
      )
    }

    // Verificar si ya existe un participante con este email
    const existingParticipante = await prisma.participante.findFirst({
      where: { email: body.email }
    })

    if (existingParticipante) {
      return NextResponse.json(
        { error: "Ya existe un registro con este email" },
        { status: 400 }
      )
    }

    // Buscar el usuario por email (si existe de la autenticación)
    let userId = null
    const user = await prisma.user.findUnique({
      where: { email: body.email }
    })
    
    if (user) {
      userId = user.id
    }

    // Crear el participante
    const participante = await prisma.participante.create({
      data: {
        userId: userId || undefined,
        nombre: body.nombre,
        apellidos: body.apellidos,
        edad: parseInt(body.edad),
        genero: body.genero,
        residencia: body.residencia || undefined,
        telefono: body.telefono || undefined,
        email: body.email
      }
    })
    // Crear las respuestas vinculadas al participante
    const respuesta = await prisma.respuesta.create({
      data: {
        participanteId: participante.id,
        
        // Filtros obligatorios
        franjaEdad: body.franjaEdad || [],
        sexualidad: body.sexualidad,
        
        // Estilo de vida
        gruposIdentificacion: body.gruposIdentificacion || [],
        deportes: body.deportes || [],
        fumador: body.fumador || "",
        formaVestir: body.formaVestir || [],
        tipoCasa: body.tipoCasa || [],
        
        // Objetivos relacionales
        queBuscas: body.queBuscas || [],
        hijos: body.hijos || [],
        valores: body.valores || [],
        visionFuturo: body.visionFuturo || [],
        
        // Compatibilidad física/sexual
        atraccionFisica: body.atraccionFisica || [],
        importanciaSexo: body.importanciaSexo || [],
        queValoras: body.queValoras || [],
        
        // Intelectual/Cultural
        formacion: body.formacion || [],
        idiomas: body.idiomas || [],
        visionVida: body.visionVida || "",
        
        // Factores de descarte y otros
        factoresDescarte: body.factoresDescarte || [],
        opinionDrogas: body.opinionDrogas || "",
        opinionAlcohol: body.opinionAlcohol || "",
        suenos: body.suenos || []
      }
    })

    return NextResponse.json(
      {
        message: "Formulario guardado exitosamente",
        participante: {
          id: participante.id,
          nombre: participante.nombre,
          email: participante.email
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error guardando formulario:", error)
    return NextResponse.json(
      { error: "Error al guardar el formulario" },
      { status: 500 }
    )
  }
}