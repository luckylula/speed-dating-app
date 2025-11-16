"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestMatchingPage() {
  const [resultado, setResultado] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const calcularMatches = async () => {
    setLoading(true)
    setError("")
    setResultado(null)

    try {
      const response = await fetch('/api/eventos/cmhubjh4b0000ncv4a3alldz3/calcular-matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (response.ok) {
        setResultado(data)
      } else {
        setError(data.error || "Error desconocido")
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Test Algoritmo de Matching</CardTitle>
            <p className="text-gray-600 mt-2">
              Este botón ejecutará el algoritmo de matching para el evento de prueba.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button 
              onClick={calcularMatches}
              disabled={loading}
              className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-6 text-lg"
            >
              {loading ? "Calculando..." : "CALCULAR MATCHES"}
            </Button>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md">
                <p className="font-bold">Error:</p>
                <p>{error}</p>
              </div>
            )}

            {resultado && (
              <div className="bg-green-50 border border-green-200 p-6 rounded-md space-y-4">
                <p className="text-green-800 font-bold text-xl">
                  MATCHES CALCULADOS EXITOSAMENTE
                </p>
                
                <div className="bg-white p-4 rounded-md">
                  <h3 className="font-bold text-lg mb-2">Resumen:</h3>
                  <ul className="space-y-2">
                    <li><strong>Total de matches:</strong> {resultado.totalMatches}</li>
                    <li><strong>Total de participantes:</strong> {resultado.totalParticipantes}</li>
                    <li><strong>Promedio de compatibilidad:</strong> {resultado.promedioCompatibilidad}%</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>Ahora ve a Prisma Studio para ver los matches detallados</strong>
                  </p>
                  <a 
                    href="http://localhost:5555" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    Abrir Prisma Studio
                  </a>
                </div>

                <details className="bg-gray-50 p-4 rounded-md">
                  <summary className="cursor-pointer font-semibold">Ver respuesta completa</summary>
                  <pre className="mt-2 text-xs overflow-auto">
                    {JSON.stringify(resultado, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}