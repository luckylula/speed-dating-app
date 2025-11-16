"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState({
    totalParticipantes: 0,
    totalEventos: 0,
    totalMatches: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log("📊 Cargando estadísticas...")
        console.log("👤 Sesión actual:", session)
        
        const response = await fetch("/api/admin/stats")
        
        if (response.ok) {
          const data = await response.json()
          console.log("✅ Estadísticas cargadas:", data)
          setStats(data)
        } else {
          console.log("❌ Error en respuesta:", response.status)
        }
      } catch (error) {
        console.error("❌ Error cargando estadísticas:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [session])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <p className="text-xl">Cargando panel de administración...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-600 mt-2">
            Bienvenida{session?.user?.name ? `, ${session.user.name}` : ""}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Participantes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-pink-600">{stats.totalParticipantes}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Eventos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-purple-600">{stats.totalEventos}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Matches</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-600">{stats.totalMatches}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/admin/participantes">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-xl">👥 Participantes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Ver y gestionar todos los participantes registrados</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/eventos">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-xl">📅 Eventos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Crear y gestionar eventos de speed dating</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/matches">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-xl">💕 Matches</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Ver resultados y generar nuevos matches</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/test-matching">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full bg-pink-50">
              <CardHeader>
                <CardTitle className="text-xl">🧪 Test Algoritmo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Probar el algoritmo de matching</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="mt-8">
          <Link href="/api/auth/signout">
            <Button variant="outline">Cerrar Sesión</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}