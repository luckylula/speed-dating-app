import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Comenzando seed de datos de prueba...')

  // Limpiar datos anteriores (opcional)
  await prisma.match.deleteMany({})
  await prisma.respuesta.deleteMany({})
  await prisma.eventoParticipante.deleteMany({})
  await prisma.participante.deleteMany({})
  await prisma.user.deleteMany({})

  // Crear evento de prueba
  const evento = await prisma.evento.create({
    data: {
      nombre: "Speed Dating Madrid - Diciembre 2024",
      descripcion: "Evento de prueba para testing del algoritmo",
      fecha: new Date("2024-12-15"),
      lugar: "Madrid Centro",
      maxParticipantes: 50,
      estado: "activo"
    }
  })

  console.log('✅ Evento creado:', evento.nombre)

  // Participantes de prueba
  const participantes = [
    {
      nombre: "Carlos",
      apellidos: "García",
      edad: 28,
      genero: "HOMBRE",
      email: "carlos@test.com",
      respuestas: {
        franjaEdad: ["DE 25 A 30 AÑOS", "DE 30 A 40 AÑOS"],
        sexualidad: "HETEROSEXUAL",
        gruposIdentificacion: ["DEPORTISTAS", "VIAJERO"],
        deportes: ["RUNNER", "CICLISMO/BTT"],
        fumador: "NO FUMADOR/A",
        formaVestir: ["CASUAL", "DEPORTIVO"],
        tipoCasa: ["MODERNA", "URBANITA"],
        queBuscas: ["RELACION ESTABLE"],
        hijos: ["NO", "ME GUSTARIA TENER"],
        valores: ["LEALTAD", "FIDELIDAD", "FELICIDAD"],
        visionFuturo: ["VIVIENDO CON MI PAREJA", "FORMANDO UNA FAMILIA"],
        atraccionFisica: ["SONRISA", "QUE SEA COMO SEA, SE CUIDE!"],
        importanciaSexo: ["ES FUNDAMENTAL PARA QUE FUNCIONE LA RELACION"],
        queValoras: ["BUENA CONVERSACION", "LEALTAD", "RISAS"],
        formacion: ["LICENCIATURA", "MASTER"],
        idiomas: ["CASTELLANO", "INGLES"],
        visionVida: "UN VIAJE QUE TOCA DISFRUTARLO AL MAXIMO",
        factoresDescarte: ["INFIDELIDAD", "LA MENTIRA"],
        opinionDrogas: "NO LAS CONSUMO",
        opinionAlcohol: "BEBO DE FORMA ESPORADICA",
        suenos: ["DAR LA VUELTA AL MUNDO", "HACER UN SAFARI EN AFRICA"]
      }
    },
    {
      nombre: "María",
      apellidos: "López",
      edad: 26,
      genero: "MUJER",
      email: "maria@test.com",
      respuestas: {
        franjaEdad: ["DE 25 A 30 AÑOS", "DE 30 A 40 AÑOS"],
        sexualidad: "HETEROSEXUAL",
        gruposIdentificacion: ["DEPORTISTAS", "VIAJERO", "YOGUI Y MUNDO MEDITACION"],
        deportes: ["RUNNER", "FITNESS/ GYM/ CROSSFIT"],
        fumador: "NO FUMADOR/A",
        formaVestir: ["CASUAL", "DEPORTIVO"],
        tipoCasa: ["MODERNA", "URBANITA"],
        queBuscas: ["RELACION ESTABLE"],
        hijos: ["NO", "ME GUSTARIA TENER"],
        valores: ["LEALTAD", "FIDELIDAD", "FELICIDAD", "EMPATIA"],
        visionFuturo: ["VIVIENDO CON MI PAREJA", "FORMANDO UNA FAMILIA"],
        atraccionFisica: ["SONRISA", "QUE SEA COMO SEA, SE CUIDE!", "FORMA DE HABLAR Y COMUNICARSE"],
        importanciaSexo: ["ES FUNDAMENTAL PARA QUE FUNCIONE LA RELACION"],
        queValoras: ["BUENA CONVERSACION", "LEALTAD", "PAZ MENTAL"],
        formacion: ["LICENCIATURA"],
        idiomas: ["CASTELLANO", "INGLES", "FRANCES"],
        visionVida: "DIA A DIA, UN APRENDIZAJE CONTINUO",
        factoresDescarte: ["CELOS", "INFIDELIDAD", "LA MENTIRA"],
        opinionDrogas: "NO LAS CONSUMO",
        opinionAlcohol: "BEBO DE FORMA ESPORADICA",
        suenos: ["DAR LA VUELTA AL MUNDO", "AYUDAR EN UNA ONG"]
      }
    },
    {
      nombre: "Laura",
      apellidos: "Martínez",
      edad: 32,
      genero: "MUJER",
      email: "laura@test.com",
      respuestas: {
        franjaEdad: ["DE 30 A 40 AÑOS"],
        sexualidad: "HETEROSEXUAL",
        gruposIdentificacion: ["INTELECTUAL", "VIAJERO", "CASER@"],
        deportes: [],
        fumador: "NO FUMADOR/A",
        formaVestir: ["ELEGANTE", "A LA MODA"],
        tipoCasa: ["HOGAREÑA", "MODERNA"],
        queBuscas: ["RELACION ESTABLE", "LO QUE SURJA"],
        hijos: ["NO", "ME GUSTARIA TENER"],
        valores: ["ESTABILIDAD", "FELICIDAD", "COMPAÑÍA"],
        visionFuturo: ["VIVIENDO CON MI PAREJA", "CREANDO UN PROYECTO EN PAREJA"],
        atraccionFisica: ["OJOS CLAROS", "FORMA DE HABLAR Y COMUNICARSE"],
        importanciaSexo: ["MEJOR CALIDAD, QUE CANTIDAD"],
        queValoras: ["BUENA CONVERSACION", "SEA LEAL Y BUENA PERSONA", "IMPLICACION Y DEDICACION"],
        formacion: ["MASTER", "EMPRESARIO"],
        idiomas: ["CASTELLANO", "INGLES", "ITALIANO"],
        visionVida: "UN BUEN LIBRO CON INCIO Y FIN, Y QUE YO MISMO PUEDO REESCRIBIR",
        factoresDescarte: ["FALSEDAD", "LA MENTIRA"],
        opinionDrogas: "ESTOY EN CONTRA Y NO LAS QUIERO!",
        opinionAlcohol: "BEBO DE FORMA ESPORADICA",
        suenos: ["TENER UNA CASA EN LA PLAYA", "CREAR UN NEGOCIO MILLONARIO"]
      }
    },
    {
      nombre: "David",
      apellidos: "Rodríguez",
      edad: 35,
      genero: "HOMBRE",
      email: "david@test.com",
      respuestas: {
        franjaEdad: ["DE 30 A 40 AÑOS", "DE 25 A 30 AÑOS"],
        sexualidad: "HETEROSEXUAL",
        gruposIdentificacion: ["INTELECTUAL", "VIAJERO", "EMPRESARIO"],
        deportes: [],
        fumador: "NO FUMADOR/A",
        formaVestir: ["ELEGANTE", "CASUAL"],
        tipoCasa: ["MODERNA", "URBANITA"],
        queBuscas: ["RELACION ESTABLE"],
        hijos: ["NO", "ME GUSTARIA TENER"],
        valores: ["ESTABILIDAD", "FELICIDAD", "LEALTAD"],
        visionFuturo: ["VIVIENDO CON MI PAREJA", "CREANDO UN PROYECTO EN PAREJA", "FORMANDO UNA FAMILIA"],
        atraccionFisica: ["SONRISA", "FORMA DE HABLAR Y COMUNICARSE"],
        importanciaSexo: ["MEJOR CALIDAD, QUE CANTIDAD"],
        queValoras: ["BUENA CONVERSACION", "SEA LEAL Y BUENA PERSONA"],
        formacion: ["MASTER", "EMPRESARIO", "EMPRENDEDOR/A"],
        idiomas: ["CASTELLANO", "INGLES", "FRANCES"],
        visionVida: "UNA PELICULA EN LA QUE YO QUIERO SER EL GUIONISTA Y PROTAGONISTA PRINCIPAL",
        factoresDescarte: ["FALSEDAD", "LA MENTIRA"],
        opinionDrogas: "NO LAS CONSUMO",
        opinionAlcohol: "BEBO DE FORMA ESPORADICA",
        suenos: ["CREAR UN NEGOCIO MILLONARIO", "DAR LA VUELTA AL MUNDO"]
      }
    },
    {
      nombre: "Ana",
      apellidos: "Fernández",
      edad: 24,
      genero: "MUJER",
      email: "ana@test.com",
      respuestas: {
        franjaEdad: ["DE 18 A 25 AÑOS", "DE 25 A 30 AÑOS"],
        sexualidad: "HETEROSEXUAL",
        gruposIdentificacion: ["FIESTERO", "FESTIVALER@", "BAILARIN/A"],
        deportes: [],
        fumador: "FUMADOR/A",
        formaVestir: ["FASHION", "TRENDY", "A LA MODA"],
        tipoCasa: ["COMPARTO CON MAS GENTE", "URBANITA"],
        queBuscas: ["LO QUE SURJA", "CONOCER GENTE PARA HACER PLANES"],
        hijos: ["NO QUIERO! ESTOY GENIAL ASI!"],
        valores: ["DIVERSION", "RISAS", "LIBERTAD"],
        visionFuturo: ["LIBRE COMO UN PAJARO", "VIAJANDO POR EL MUNDO EN PAREJA"],
        atraccionFisica: ["TATUAJES", "PIERCINGS", "QUE SEA SEXY Y SENSUAL"],
        importanciaSexo: ["CUANTO MAS MEJOR!", "ME ENCANTA INNOVAR Y FANTASEAR"],
        queValoras: ["RISAS", "LIBERTAD", "QUE NO SEA CELOS@"],
        formacion: ["ESTUDIOS BASICOS", "ESCUELA DE LA VIDA"],
        idiomas: ["CASTELLANO", "INGLES"],
        visionVida: "UN VIAJE QUE TOCA DISFRUTARLO AL MAXIMO",
        factoresDescarte: ["CELOS"],
        opinionDrogas: "CONSUMO DE FORMA ESPORADICA",
        opinionAlcohol: "BEBO HABITUALMENTE",
        suenos: ["DAR LA VUELTA AL MUNDO", "VOLAR EN PARACAIDAS"]
      }
    },
    {
      nombre: "Pedro",
      apellidos: "Sánchez",
      edad: 29,
      genero: "HOMBRE",
      email: "pedro@test.com",
      respuestas: {
        franjaEdad: ["DE 25 A 30 AÑOS", "DE 18 A 25 AÑOS"],
        sexualidad: "HETEROSEXUAL",
        gruposIdentificacion: ["DEPORTISTAS", "FESTIVALER@", "GAMER"],
        deportes: ["FUTBOLER@", "FITNESS/ GYM/ CROSSFIT"],
        fumador: "LO ESTOY DEJANDO",
        formaVestir: ["CASUAL", "DEPORTIVO"],
        tipoCasa: ["COMPARTO CON MAS GENTE", "URBANITA"],
        queBuscas: ["RELACION SIN COMPROMISO", "LO QUE SURJA"],
        hijos: ["NO"],
        valores: ["DIVERSION", "LIBERTAD", "PASION"],
        visionFuturo: ["LIBRE COMO UN PAJARO"],
        atraccionFisica: ["CUERPO DELGAD@S", "QUE SEA SEXY Y SENSUAL"],
        importanciaSexo: ["CUANTO MAS MEJOR!"],
        queValoras: ["BUEN SEXO", "LIBERTAD", "RISAS"],
        formacion: ["FORMACION PROFESIONAL"],
        idiomas: ["CASTELLANO"],
        visionVida: "UN VIAJE QUE TOCA DISFRUTARLO AL MAXIMO",
        factoresDescarte: ["QUERER UNA RELACION ESTABLE"],
        opinionDrogas: "CONSUMO DE FORMA ESPORADICA",
        opinionAlcohol: "BEBO HABITUALMENTE",
        suenos: ["VOLAR EN PARACAIDAS", "TENER UN DEPORTIVO"]
      }
    },
    {
      nombre: "Sofía",
      apellidos: "Ruiz",
      edad: 27,
      genero: "MUJER",
      email: "sofia@test.com",
      respuestas: {
        franjaEdad: ["DE 25 A 30 AÑOS", "DE 30 A 40 AÑOS"],
        sexualidad: "BISEXUAL",
        gruposIdentificacion: ["ARTISTA", "YOGUI Y MUNDO MEDITACION", "MUSICO"],
        deportes: [],
        fumador: "NO FUMADOR/A",
        formaVestir: ["MI PROPIA MODA", "CASUAL"],
        tipoCasa: ["HOGAREÑA", "EN EL CAMPO"],
        queBuscas: ["LO QUE SURJA", "RELACION ABIERTA"],
        hijos: ["NO", "ME GUSTARIA ADOPTAR"],
        valores: ["LIBERTAD", "EMPATIA", "FELICIDAD"],
        visionFuturo: ["LIBRE COMO UN PAJARO", "CREANDO UN PROYECTO EN PAREJA"],
        atraccionFisica: ["OJOS OSCUROS", "TATUAJES", "FORMA DE HABLAR Y COMUNICARSE"],
        importanciaSexo: ["ME ENCANTA INNOVAR Y FANTASEAR", "SOY MUY ORIGINAL"],
        queValoras: ["PAZ MENTAL", "COMPARTIR AFICIONES", "QUE NO SEA CELOS@"],
        formacion: ["DIPLOMATURA", "ARTISTA"],
        idiomas: ["CASTELLANO", "INGLES", "FRANCES"],
        visionVida: "DIA A DIA, UN APRENDIZAJE CONTINUO",
        factoresDescarte: ["CELOS"],
        opinionDrogas: "ESTOY A FAVOR PERO NO LAS CONSUMO",
        opinionAlcohol: "NO BEBO",
        suenos: ["AYUDAR EN UNA ONG", "CONOCER A MI ARTISTA FAVORITO"]
      }
    },
    {
      nombre: "Javier",
      apellidos: "Moreno",
      edad: 31,
      genero: "HOMBRE",
      email: "javier@test.com",
      respuestas: {
        franjaEdad: ["DE 25 A 30 AÑOS", "DE 30 A 40 AÑOS"],
        sexualidad: "HOMOSEXUAL",
        gruposIdentificacion: ["DEPORTISTAS", "VIAJERO"],
        deportes: ["RUNNER", "NATACION"],
        fumador: "NO FUMADOR/A",
        formaVestir: ["ELEGANTE", "FASHION"],
        tipoCasa: ["MODERNA", "URBANITA"],
        queBuscas: ["RELACION ESTABLE"],
        hijos: ["ME GUSTARIA ADOPTAR"],
        valores: ["LEALTAD", "FIDELIDAD", "FELICIDAD"],
        visionFuturo: ["VIVIENDO CON MI PAREJA", "FORMANDO UNA FAMILIA"],
        atraccionFisica: ["CUERPO MUSCULAD@S", "SONRISA"],
        importanciaSexo: ["ES FUNDAMENTAL PARA QUE FUNCIONE LA RELACION"],
        queValoras: ["BUENA CONVERSACION", "SEA LEAL Y BUENA PERSONA"],
        formacion: ["LICENCIATURA", "MASTER"],
        idiomas: ["CASTELLANO", "INGLES", "FRANCES"],
        visionVida: "UN VIAJE QUE TOCA DISFRUTARLO AL MAXIMO",
        factoresDescarte: ["INFIDELIDAD", "LA MENTIRA"],
        opinionDrogas: "NO LAS CONSUMO",
        opinionAlcohol: "BEBO DE FORMA ESPORADICA",
        suenos: ["DAR LA VUELTA AL MUNDO", "NADAR CON DELFINES Y BALLENAS"]
      }
    },
    {
      nombre: "Miguel",
      apellidos: "Jiménez",
      edad: 33,
      genero: "HOMBRE",
      email: "miguel@test.com",
      respuestas: {
        franjaEdad: ["DE 30 A 40 AÑOS"],
        sexualidad: "HOMOSEXUAL",
        gruposIdentificacion: ["INTELECTUAL", "ARTISTA", "MUSICO"],
        deportes: [],
        fumador: "NO FUMADOR/A",
        formaVestir: ["ELEGANTE", "MI PROPIA MODA"],
        tipoCasa: ["HOGAREÑA", "MODERNA"],
        queBuscas: ["RELACION ESTABLE"],
        hijos: ["ME GUSTARIA ADOPTAR"],
        valores: ["COMPAÑÍA", "LEALTAD", "EMPATIA"],
        visionFuturo: ["VIVIENDO CON MI PAREJA", "FORMANDO UNA FAMILIA"],
        atraccionFisica: ["OJOS CLAROS", "FORMA DE HABLAR Y COMUNICARSE"],
        importanciaSexo: ["MEJOR CALIDAD, QUE CANTIDAD", "CON CARIÑO Y AMOR"],
        queValoras: ["BUENA CONVERSACION", "COMPARTIR AFICIONES", "PAZ MENTAL"],
        formacion: ["LICENCIATURA", "MASTER"],
        idiomas: ["CASTELLANO", "INGLES", "ITALIANO"],
        visionVida: "UN BUEN LIBRO CON INCIO Y FIN, Y QUE YO MISMO PUEDO REESCRIBIR",
        factoresDescarte: ["INFIDELIDAD", "LA MENTIRA"],
        opinionDrogas: "NO LAS CONSUMO",
        opinionAlcohol: "BEBO DE FORMA ESPORADICA",
        suenos: ["CONOCER A MI ARTISTA FAVORITO", "TENER UNA CASA EN LA PLAYA"]
      }
    },
    {
      nombre: "Elena",
      apellidos: "Torres",
      edad: 29,
      genero: "MUJER",
      email: "elena@test.com",
      respuestas: {
        franjaEdad: ["DE 25 A 30 AÑOS", "DE 30 A 40 AÑOS"],
        sexualidad: "BISEXUAL",
        gruposIdentificacion: ["DEPORTISTAS", "VIAJERO", "ARTISTA"],
        deportes: ["YOGA", "SENDERISMO / TREKKING"],
        fumador: "NO FUMADOR/A",
        formaVestir: ["CASUAL", "MI PROPIA MODA"],
        tipoCasa: ["CERCA DEL MAR", "MODERNA"],
        queBuscas: ["LO QUE SURJA", "QUE LA VIDA ME SORPRENDA"],
        hijos: ["NO"],
        valores: ["LIBERTAD", "FELICIDAD", "DIVERSION"],
        visionFuturo: ["VIAJANDO POR EL MUNDO EN PAREJA", "LIBRE COMO UN PAJARO"],
        atraccionFisica: ["SONRISA", "TATUAJES", "QUE SEA COMO SEA, SE CUIDE!"],
        importanciaSexo: ["ME ENCANTA INNOVAR Y FANTASEAR"],
        queValoras: ["RISAS", "LIBERTAD", "QUE NO SEA CELOS@"],
        formacion: ["LICENCIATURA"],
        idiomas: ["CASTELLANO", "INGLES"],
        visionVida: "UN VIAJE QUE TOCA DISFRUTARLO AL MAXIMO",
        factoresDescarte: ["CELOS"],
        opinionDrogas: "NO LAS CONSUMO",
        opinionAlcohol: "BEBO DE FORMA ESPORADICA",
        suenos: ["DAR LA VUELTA AL MUNDO", "NADAR CON DELFINES Y BALLENAS"]
      }
    }
  ]

  // Insertar cada participante con sus respuestas
  for (const p of participantes) {
    const hashedPassword = await bcrypt.hash('password123', 10)
    
    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email: p.email,
        password: hashedPassword,
        nombre: p.nombre,
        apellidos: p.apellidos,
        rol: 'usuario'
      }
    })

    // Crear participante
    const participante = await prisma.participante.create({
      data: {
        userId: user.id,
        nombre: p.nombre,
        apellidos: p.apellidos,
        edad: p.edad,
        genero: p.genero,
        residencia: "Madrid",
        telefono: "600000000",
        email: p.email
      }
    })

    // Crear respuestas
    await prisma.respuesta.create({
      data: {
        participanteId: participante.id,
        ...p.respuestas
      }
    })

    // Inscribir al evento
    await prisma.eventoParticipante.create({
      data: {
        eventoId: evento.id,
        participanteId: participante.id,
        estadoPago: "pagado"
      }
    })

    console.log(`✅ Creado: ${p.nombre} ${p.apellidos}`)
  }

  console.log('\n🎉 Seed completado exitosamente!')
  console.log(`📊 Total: ${participantes.length} participantes creados`)
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
  