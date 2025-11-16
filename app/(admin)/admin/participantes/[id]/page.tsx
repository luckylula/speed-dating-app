"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Participante {
  id: string
  nombre: string
  apellidos: string
  edad: number
  genero: string
  email: string
  telefono: string
  residencia: string
  user: {
    email: string
    createdAt: string
  }
  eventosInscritos: Array<{
    evento: {
      nombre: string
      fecha: string
    }
  }>
  respuestas?: {
    franjaEdad: string[]
    sexualidad: string
    gruposIdentificacion: string[]
    deportes: string[]
    fumador: string
    formaVestir: string[]
    tipoCasa: string[]
    queBuscas: string[]
    hijos: string[]
    valores: string[]
    visionFuturo: string[]
    atraccionFisica: string[]
    importanciaSexo: string[]
    queValoras: string[]
    formacion: string[]
    idiomas: string[]
    visionVida: string
    factoresDescarte: string[]
    opinionDrogas: string
    opinionAlcohol: string
    suenos: string[]
  }
}

export default function ParticipanteDetallePage() {
  const params = useParams()
  const router = useRouter()
  const [participante, setParticipante] = useState<Participante | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchParticipante = async () => {
      try {
        const response = await fetch(`/api/admin/participantes/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setParticipante(data)
        } else {
          alert("Participante no encontrado")
          router.push("/admin/participantes")
        }
      } catch (error) {
        console.error("Error cargando participante:", error)
        alert("Error al cargar participante")
        router.push("/admin/participantes")
      } finally {
        setLoading(false)
      }
    }

    fetchParticipante()
  }, [params.id, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Cargando información...</p>
      </div>
    )
  }

  if (!participante) {
    return null
  }

  const r = participante.respuestas

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              {participante.nombre} {participante.apellidos}
            </h1>
            <p className="text-gray-600 mt-2">
              {participante.genero} • {participante.edad} años
            </p>
          </div>
          <Link href="/admin/participantes">
            <Button variant="outline">← Volver a Participantes</Button>
          </Link>
        </div>

        {/* Información básica */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>📋 Información Básica</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="font-semibold">Email:</span> {participante.email}
            </div>
            <div>
              <span className="font-semibold">Teléfono:</span> {participante.telefono || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Residencia:</span> {participante.residencia || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Evento:</span>{" "}
              {participante.eventosInscritos.length > 0
                ? participante.eventosInscritos[0].evento.nombre
                : "N/A"}
            </div>
            <div>
              <span className="font-semibold">Registro:</span>{" "}
              {new Date(participante.user.createdAt).toLocaleDateString('es-ES')}
            </div>
          </CardContent>
        </Card>

        {!r && (
          <Card>
            <CardContent className="py-8 text-center text-gray-600">
              Este participante aún no ha completado el cuestionario
            </CardContent>
          </Card>
        )}

        {r && (
          <>
            {/* Preferencias básicas */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>🎯 Preferencias Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="font-semibold">Franja de edad buscada:</span>{" "}
                  {r.franjaEdad.join(", ")}
                </div>
                <div>
                  <span className="font-semibold">Orientación sexual:</span> {r.sexualidad}
                </div>
              </CardContent>
            </Card>

            {/* Estilo de vida */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>🏃 Estilo de Vida</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="font-semibold">Grupos de identificación:</span>{" "}
                  {r.gruposIdentificacion.join(", ")}
                </div>
                <div>
                  <span className="font-semibold">Deportes:</span> {r.deportes.join(", ")}
                </div>
                <div>
                  <span className="font-semibold">Fumador:</span> {r.fumador}
                </div>
                <div>
                  <span className="font-semibold">Forma de vestir:</span>{" "}
                  {r.formaVestir.join(", ")}
                </div>
                <div>
                  <span className="font-semibold">Tipo de casa:</span> {r.tipoCasa.join(", ")}
                </div>
              </CardContent>
            </Card>

            {/* Objetivos relacionales */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>💕 Objetivos y Valores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="font-semibold">Qué busca:</span> {r.queBuscas.join(", ")}
                </div>
                <div>
                  <span className="font-semibold">Hijos:</span> {r.hijos.join(", ")}
                </div>
                <div>
                  <span className="font-semibold">Valores importantes:</span>{" "}
                  {r.valores.join(", ")}
                </div>
                <div>
                  <span className="font-semibold">Visión de futuro:</span>{" "}
                  {r.visionFuturo.join(", ")}
                </div>
              </CardContent>
            </Card>

            {/* Compatibilidad física/sexual */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>💫 Compatibilidad Física y Sexual</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="font-semibold">Atracción física:</span>{" "}
                  {r.atraccionFisica.join(", ")}
                </div>
                <div>
                  <span className="font-semibold">Importancia del sexo:</span>{" "}
                  {r.importanciaSexo.join(", ")}
                </div>
                <div>
                  <span className="font-semibold">Qué valora:</span> {r.queValoras.join(", ")}
                </div>
              </CardContent>
            </Card>

            {/* Intelectual/Cultural */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>🎓 Intelectual y Cultural</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="font-semibold">Formación:</span> {r.formacion.join(", ")}
                </div>
                <div>
                  <span className="font-semibold">Idiomas:</span> {r.idiomas.join(", ")}
                </div>
                <div>
                  <span className="font-semibold">Visión de la vida:</span> {r.visionVida}
                </div>
              </CardContent>
            </Card>

            {/* Factores de descarte */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>🚫 Factores de Descarte</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="font-semibold">Dealbreakers:</span>{" "}
                  {r.factoresDescarte.join(", ")}
                </div>
                <div>
                  <span className="font-semibold">Opinión sobre drogas:</span>{" "}
                  {r.opinionDrogas}
                </div>
                <div>
                  <span className="font-semibold">Opinión sobre alcohol:</span>{" "}
                  {r.opinionAlcohol}
                </div>
              </CardContent>
            </Card>

            {/* Sueños y aspiraciones */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>✨ Sueños y Aspiraciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <span className="font-semibold">Sueños:</span> {r.suenos.join(", ")}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}