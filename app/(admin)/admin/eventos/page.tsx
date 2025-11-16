"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Evento {
  id: string
  nombre: string
  descripcion: string
  fecha: string
  lugar: string
  maxParticipantes: number
  estado: string
  _count?: {
    participantes: number
  }
}

export default function EventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [loading, setLoading] = useState(true)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [guardando, setGuardando] = useState(false)
  
  const [nuevoEvento, setNuevoEvento] = useState({
    nombre: "",
    descripcion: "",
    fecha: "",
    lugar: "",
    maxParticipantes: 50
  })

  useEffect(() => {
    fetchEventos()
  }, [])

  const fetchEventos = async () => {
    try {
      const response = await fetch("/api/admin/eventos")
      const data = await response.json()
      setEventos(data)
    } catch (error) {
      console.error("Error cargando eventos:", error)
    } finally {
      setLoading(false)
    }
  }

  const crearEvento = async (e: React.FormEvent) => {
    e.preventDefault()
    setGuardando(true)

    try {
      const response = await fetch("/api/admin/eventos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoEvento)
      })

      if (response.ok) {
        alert("✅ Evento creado exitosamente")
        setNuevoEvento({
          nombre: "",
          descripcion: "",
          fecha: "",
          lugar: "",
          maxParticipantes: 50
        })
        setMostrarFormulario(false)
        fetchEventos()
      } else {
        const data = await response.json()
        alert(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      console.error("Error creando evento:", error)
      alert("Error al crear evento")
    } finally {
      setGuardando(false)
    }
  }

  const cambiarEstado = async (eventoId: string, nuevoEstado: string) => {
    try {
      const response = await fetch(`/api/admin/eventos/${eventoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado })
      })

      if (response.ok) {
        alert("✅ Estado actualizado")
        fetchEventos()
      } else {
        alert("❌ Error al actualizar estado")
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Cargando eventos...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Eventos</h1>
            <p className="text-gray-600 mt-2">Total: {eventos.length} eventos</p>
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
              className="bg-pink-600 hover:bg-pink-700"
            >
              {mostrarFormulario ? "Cancelar" : "+ Crear Evento"}
            </Button>
            <Link href="/admin">
              <Button variant="outline">← Volver al Panel</Button>
            </Link>
          </div>
        </div>

        {/* Formulario de crear evento */}
        {mostrarFormulario && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Crear Nuevo Evento</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={crearEvento} className="space-y-4">
                <div>
                  <Label>Nombre del Evento *</Label>
                  <Input
                    value={nuevoEvento.nombre}
                    onChange={(e) => setNuevoEvento({...nuevoEvento, nombre: e.target.value})}
                    placeholder="Speed Dating Madrid - Enero 2025"
                    required
                  />
                </div>

                <div>
                  <Label>Descripción</Label>
                  <textarea
                    value={nuevoEvento.descripcion}
                    onChange={(e) => setNuevoEvento({...nuevoEvento, descripcion: e.target.value})}
                    placeholder="Evento especial para solteros de 25-35 años..."
                    className="w-full p-2 border rounded-md min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Fecha del Evento *</Label>
                    <Input
                      type="date"
                      value={nuevoEvento.fecha}
                      onChange={(e) => setNuevoEvento({...nuevoEvento, fecha: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <Label>Lugar *</Label>
                    <Input
                      value={nuevoEvento.lugar}
                      onChange={(e) => setNuevoEvento({...nuevoEvento, lugar: e.target.value})}
                      placeholder="Madrid Centro"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>Máximo de Participantes *</Label>
                  <Input
                    type="number"
                    value={nuevoEvento.maxParticipantes}
                    onChange={(e) => setNuevoEvento({...nuevoEvento, maxParticipantes: parseInt(e.target.value)})}
                    min="10"
                    max="200"
                    required
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setMostrarFormulario(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit"
                    disabled={guardando}
                    className="bg-pink-600 hover:bg-pink-700"
                  >
                    {guardando ? "Guardando..." : "Crear Evento"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Lista de eventos */}
        <div className="space-y-4">
          {eventos.map((evento) => (
            <Card key={evento.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{evento.nombre}</CardTitle>
                    <p className="text-gray-600 mt-1">{evento.descripcion}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      evento.estado === 'activo' ? 'bg-green-100 text-green-800' :
                      evento.estado === 'finalizado' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {evento.estado.toUpperCase()}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <span className="text-sm text-gray-500">Fecha:</span>
                    <p className="font-semibold">{new Date(evento.fecha).toLocaleDateString('es-ES')}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Lugar:</span>
                    <p className="font-semibold">{evento.lugar}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Participantes:</span>
                    <p className="font-semibold">{evento._count?.participantes || 0} / {evento.maxParticipantes}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Estado:</span>
                    <select
                      value={evento.estado}
                      onChange={(e) => cambiarEstado(evento.id, e.target.value)}
                      className="font-semibold p-1 border rounded"
                    >
                      <option value="activo">Activo</option>
                      <option value="cerrado">Cerrado</option>
                      <option value="finalizado">Finalizado</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/admin/eventos/${evento.id}/participantes`}>
                    <Button size="sm" variant="outline">
                      Ver Participantes
                    </Button>
                  </Link>
                  <Link href={`/admin/matches?evento=${evento.id}`}>
                    <Button size="sm" variant="outline">
                      Ver Matches
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {eventos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No hay eventos creados</p>
            <Button 
              onClick={() => setMostrarFormulario(true)}
              className="bg-pink-600 hover:bg-pink-700"
            >
              + Crear Primer Evento
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}