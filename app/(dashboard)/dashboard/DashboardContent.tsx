"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DashboardContent() {
  const { data: session, status } = useSession()
  const router = useRouter()

 useEffect(() => {
  if (status === "unauthenticated") {
    router.push("/login")
  }
  // Redirigir a admin si el rol es admin
  if (status === "authenticated" && session?.user && (session.user as any).rol === 'admin') {
    router.push("/admin")
  }
}, [status, router, session])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Cargando...</p>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Bienvenid@ al Dashboard</CardTitle>
            <p className="text-gray-600 mt-2">Hola, {session.user?.name}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
                <h3 className="font-semibold mb-2">Estado de tu registro</h3>
                <ul className="space-y-2">
                  <li>✅ Formulario completado</li>
                  <li>⏳ Esperando generación de matches</li>
                  <li>🔔 Te notificaremos cuando tus matches estén listos</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Próximos pasos:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>El organizador del evento generará los matches antes del evento</li>
                  <li>Recibirás un email con tus matches más compatibles</li>
                  <li>Podrás ver información detallada de cada match</li>
                  <li>En el evento, sabrás con quién tienes mayor compatibilidad</li>
                </ul>
              </div>

              <Button className="bg-pink-600 hover:bg-pink-700 mt-6">
                Ver Mis Matches (próximamente)
              </Button>

              <div className="mt-6">
                <Link href="/api/auth/signout">
                  <Button variant="outline">Cerrar Sesión</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
