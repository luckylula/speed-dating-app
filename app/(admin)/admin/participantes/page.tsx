"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { exportarParticipantesAExcel } from "@/lib/exportar-excel"

interface Participante {
  id: string
  nombre: string
  apellidos: string
  edad: number
  genero: string
  email: string
  telefono: string
  residencia: string
  createdAt: string
}

export default function ParticipantesPage() {
  const [participantes, setParticipantes] = useState<Participante[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState("")

  useEffect(() => {
    fetchParticipantes()
  }, [])

  const fetchParticipantes = async () => {
    try {
      const response = await fetch("/api/admin/participantes")
      const data = await response.json()
      setParticipantes(data)
    } catch (error) {
      console.error("Error cargando participantes:", error)
    } finally {
      setLoading(false)
    }
  }

  const participantesFiltrados = participantes.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.apellidos.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.email.toLowerCase().includes(busqueda.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Cargando participantes...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Participantes</h1>
            <p className="text-gray-600 mt-2">Total: {participantes.length} participantes registrados</p>
          </div>
          <Link href="/admin">
            <Button variant="outline">← Volver al Panel</Button>
          </Link>
        </div>

        {/* Buscador */}
        <div className="mb-6 flex gap-4 items-center">
          <Input
            type="text"
            placeholder="Buscar por nombre, apellidos o email..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="max-w-md"
          />
          <Button 
            onClick={() => exportarParticipantesAExcel(participantes)}
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            📊 Exportar a Excel
          </Button>
        </div>
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Buscar por nombre, apellidos o email..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Lista de participantes */}
        <div className="grid grid-cols-1 gap-4">
          {participantesFiltrados.map((participante) => (
            <Card key={participante.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>
                    {participante.nombre} {participante.apellidos}
                  </span>
                  <span className="text-sm font-normal text-gray-500">
                    {participante.genero} • {participante.edad} años
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Email:</span> {participante.email}
                  </div>
                  <div>
                    <span className="font-semibold">Teléfono:</span> {participante.telefono || "N/A"}
                  </div>
                  <div>
                    <span className="font-semibold">Residencia:</span> {participante.residencia || "N/A"}
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link href={`/admin/participantes/${participante.id}`}>
                    <Button size="sm" variant="outline">
                      Ver Respuestas
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {participantesFiltrados.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No se encontraron participantes con esa búsqueda</p>
          </div>
        )}
      </div>
    </div>
  )
}