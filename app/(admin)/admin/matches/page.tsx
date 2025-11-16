"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { exportarMatchesAExcel } from "@/lib/exportar-excel"

interface Match {
  id: string
  porcentajeTotal: number
  estiloVida: number
  objetivos: number
  fisica: number
  intelectual: number
  descarte: number
  participanteA: {
    nombre: string
    apellidos: string
    edad: number
    genero: string
  }
  participanteB: {
    nombre: string
    apellidos: string
    edad: number
    genero: string
  }
  evento: {
    nombre: string
  }
}

interface Evento {
  id: string
  nombre: string
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [eventos, setEventos] = useState<Evento[]>([])
  const [eventoSeleccionado, setEventoSeleccionado] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [generando, setGenerando] = useState(false)

  useEffect(() => {
    fetchEventos()
    fetchMatches()
  }, [])

  const fetchEventos = async () => {
    try {
      const response = await fetch("/api/admin/eventos")
      const data = await response.json()
      setEventos(data)
      if (data.length > 0) {
        setEventoSeleccionado(data[0].id)
      }
    } catch (error) {
      console.error("Error cargando eventos:", error)
    }
  }

  const fetchMatches = async () => {
    try {
      const response = await fetch("/api/admin/matches")
      const data = await response.json()
      setMatches(data)
    } catch (error) {
      console.error("Error cargando matches:", error)
    } finally {
      setLoading(false)
    }
  }

  const generarMatches = async () => {
    if (!eventoSeleccionado) {
      alert("Selecciona un evento primero")
      return
    }

    setGenerando(true)
    try {
      const response = await fetch(`/api/eventos/${eventoSeleccionado}/calcular-matches`, {
        method: 'POST'
      })

      const data = await response.json()

      if (response.ok) {
        alert(`✅ ${data.totalMatches} matches generados exitosamente!\nPromedio: ${data.promedioCompatibilidad}%`)
        fetchMatches()
      } else {
        alert(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      console.error("Error generando matches:", error)
      alert("Error al generar matches")
    } finally {
      setGenerando(false)
    }
  }

  const matchesFiltrados = eventoSeleccionado 
    ? matches.filter(m => m.evento.nombre === eventos.find(e => e.id === eventoSeleccionado)?.nombre)
    : matches

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Cargando matches...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Matches</h1>
            <p className="text-gray-600 mt-2">Total: {matches.length} matches generados</p>
          </div>
          <Link href="/admin">
            <Button variant="outline">← Volver al Panel</Button>
          </Link>
        </div>

        {/* Controles */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Generar Matches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Seleccionar Evento:</label>
                <select
                  value={eventoSeleccionado}
                  onChange={(e) => setEventoSeleccionado(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  {eventos.map(evento => (
                    <option key={evento.id} value={evento.id}>
                      {evento.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <Button 
                onClick={generarMatches}
                disabled={generando}
                className="bg-pink-600 hover:bg-pink-700"
              >
                {generando ? "Generando..." : "🚀 Generar Matches"}
              </Button>
              <Button 
                onClick={() => {
                  const eventoNombre = eventos.find(e => e.id === eventoSeleccionado)?.nombre || "evento"
                  exportarMatchesAExcel(matchesFiltrados, eventoNombre)
                }}
                disabled={matchesFiltrados.length === 0}
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                📊 Exportar a Excel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de matches */}
        <div className="space-y-4">
          {matchesFiltrados
            .sort((a, b) => b.porcentajeTotal - a.porcentajeTotal)
            .map((match) => (
            <Card key={match.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">
                    {match.participanteA.nombre} {match.participanteA.apellidos} 
                    {" "} 💕 {" "}
                    {match.participanteB.nombre} {match.participanteB.apellidos}
                  </CardTitle>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-pink-600">
                      {match.porcentajeTotal}%
                    </div>
                    <div className="text-sm text-gray-500">
                      Compatibilidad
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{match.estiloVida}%</div>
                    <div className="text-xs text-gray-600">Estilo de Vida</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{match.objetivos}%</div>
                    <div className="text-xs text-gray-600">Objetivos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-600">{match.fisica}%</div>
                    <div className="text-xs text-gray-600">Física</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{match.intelectual}%</div>
                    <div className="text-xs text-gray-600">Intelectual</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{match.descarte}%</div>
                    <div className="text-xs text-gray-600">Sin Descartes</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-semibold">Evento:</span> {match.evento.nombre}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {matchesFiltrados.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No hay matches generados para este evento</p>
            <p className="text-gray-400">Presiona el botón "Generar Matches" para crear nuevos matches</p>
          </div>
        )}
      </div>
    </div>
  )
}