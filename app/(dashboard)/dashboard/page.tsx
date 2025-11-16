"use client"

import { useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DashboardPage() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const registered = searchParams.get("registered")

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        {registered && (
          <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-md mb-6">
            <h2 className="font-bold text-lg">¡Formulario enviado exitosamente! 🎉</h2>
            <p className="mt-2">
              Tus respuestas han sido guardadas. Cuando se generen los matches para tu evento, 
              recibirás una notificación por email.
            </p>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              Bienvenid@ {session?.user?.name || "al Dashboard"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Estado de tu registro</h3>
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-sm">
                  ✅ Formulario completado<br />
                  ⏳ Esperando generación de matches<br />
                  📧 Te notificaremos cuando tus matches estén listos
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Próximos pasos</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                <li>El organizador del evento generará los matches antes del evento</li>
                <li>Recibirás un email con tus matches más compatibles</li>
                <li>Podrás ver información detallada de cada match</li>
                <li>En el evento, sabrás con quién tienes mayor compatibilidad</li>
              </ul>
            </div>

            <div className="pt-4">
              <Link href="/matches">
                <Button className="bg-pink-600 hover:bg-pink-700">
                  Ver Mis Matches (próximamente)
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}