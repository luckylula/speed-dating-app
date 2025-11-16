-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT,
    "apellidos" TEXT,
    "rol" TEXT NOT NULL DEFAULT 'usuario',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participante" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "edad" INTEGER NOT NULL,
    "genero" TEXT NOT NULL,
    "residencia" TEXT,
    "telefono" TEXT,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Participante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evento" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL,
    "lugar" TEXT NOT NULL,
    "maxParticipantes" INTEGER NOT NULL DEFAULT 50,
    "estado" TEXT NOT NULL DEFAULT 'activo',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventoParticipante" (
    "id" TEXT NOT NULL,
    "eventoId" TEXT NOT NULL,
    "participanteId" TEXT NOT NULL,
    "estadoPago" TEXT NOT NULL DEFAULT 'pendiente',
    "fechaInscripcion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventoParticipante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Respuesta" (
    "id" TEXT NOT NULL,
    "participanteId" TEXT NOT NULL,
    "franjaEdad" TEXT[],
    "sexualidad" TEXT NOT NULL,
    "gruposIdentificacion" TEXT[],
    "deportes" TEXT[],
    "fumador" TEXT NOT NULL,
    "formaVestir" TEXT[],
    "tipoCasa" TEXT[],
    "queBuscas" TEXT[],
    "hijos" TEXT[],
    "valores" TEXT[],
    "visionFuturo" TEXT[],
    "atraccionFisica" TEXT[],
    "importanciaSexo" TEXT[],
    "queValoras" TEXT[],
    "formacion" TEXT[],
    "idiomas" TEXT[],
    "visionVida" TEXT NOT NULL,
    "factoresDescarte" TEXT[],
    "opinionDrogas" TEXT NOT NULL,
    "opinionAlcohol" TEXT NOT NULL,
    "suenos" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Respuesta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "eventoId" TEXT NOT NULL,
    "participanteAId" TEXT NOT NULL,
    "participanteBId" TEXT NOT NULL,
    "porcentajeTotal" INTEGER NOT NULL,
    "estiloVida" INTEGER NOT NULL,
    "objetivos" INTEGER NOT NULL,
    "fisica" INTEGER NOT NULL,
    "intelectual" INTEGER NOT NULL,
    "descarte" INTEGER NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Participante_userId_key" ON "Participante"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "EventoParticipante_eventoId_participanteId_key" ON "EventoParticipante"("eventoId", "participanteId");

-- CreateIndex
CREATE UNIQUE INDEX "Respuesta_participanteId_key" ON "Respuesta"("participanteId");

-- CreateIndex
CREATE UNIQUE INDEX "Match_eventoId_participanteAId_participanteBId_key" ON "Match"("eventoId", "participanteAId", "participanteBId");

-- AddForeignKey
ALTER TABLE "Participante" ADD CONSTRAINT "Participante_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventoParticipante" ADD CONSTRAINT "EventoParticipante_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventoParticipante" ADD CONSTRAINT "EventoParticipante_participanteId_fkey" FOREIGN KEY ("participanteId") REFERENCES "Participante"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Respuesta" ADD CONSTRAINT "Respuesta_participanteId_fkey" FOREIGN KEY ("participanteId") REFERENCES "Participante"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_participanteAId_fkey" FOREIGN KEY ("participanteAId") REFERENCES "Participante"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_participanteBId_fkey" FOREIGN KEY ("participanteBId") REFERENCES "Participante"("id") ON DELETE CASCADE ON UPDATE CASCADE;
