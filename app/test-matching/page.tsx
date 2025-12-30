"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Participante {
  id: string
  nombre: string
  apellidos: string
}

interface Match {
  id: string
  participanteA: { nombre: string; apellidos: string }
  participanteB: { nombre: string; apellidos: string }
  porcentajeTotal: number
  estiloVida: number
  objetivos: number
  fisica: number
  intelectual: number
  descarte: number
}

interface ResultadoCalculo {
  success: boolean
  totalMatches: number
  totalParticipantes: number
  promedioCompatibilidad: number
  matches?: Match[]
}

export default function TestMatchingPage() {
  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  // Match manual
  const [participantes, setParticipantes] = useState<Participante[]>([])
  const [participanteA, setParticipanteA] = useState("")
  const [participanteB, setParticipanteB] = useState("")
  const [matchManual, setMatchManual] = useState<any>(null)
  const [loadingManual, setLoadingManual] = useState(false)

  // Cargar participantes al montar
  useState(() => {
    fetch('/api/admin/participantes')
      .then(res => res.json())
      .then(data => {
        if (data.participantes) {
          setParticipantes(data.participantes)
        }
      })
      .catch(console.error)
  })

  const calcularMatches = async () => {
    setLoading(true)
    setError("")
    setResultado(null)
    
    try {
      const response = await fetch('/api/test-matching/calcular-todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
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

  const calcularMatchManual = async () => {
    if (!participanteA || !participanteB) {
      alert("Selecciona ambos participantes")
      return
    }
    
    if (participanteA === participanteB) {
      alert("Selecciona dos participantes diferentes")
      return
    }

    setLoadingManual(true)
    setMatchManual(null)

    try {
      const response = await fetch('/api/test-matching/calcular-manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participanteAId: participanteA,
          participanteBId: participanteB
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        setMatchManual(data)
      } else {
        alert(data.error || "Error al calcular")
      }
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoadingManual(false)
    }
  }

  const limpiarMatches = async () => {
    if (!confirm("¿Eliminar todos los matches de prueba?")) return

    try {
      const response = await fetch('/api/test-matching/limpiar', {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setResultado(null)
        alert("Matches eliminados")
      }
    } catch (err) {
      alert("Error al eliminar")
    }
  }

  const getDistribucion = (matches: Match[]) => {
    const rangos = {
      '0-30%': 0,
      '30-50%': 0,
      '50-70%': 0,
      '70-100%': 0
    }

    matches.forEach(m => {
      if (m.porcentajeTotal < 30) rangos['0-30%']++
      else if (m.porcentajeTotal < 50) rangos['30-50%']++
      else if (m.porcentajeTotal < 70) rangos['50-70%']++
      else rangos['70-100%']++
    })

    return rangos
  }

  const getAlertas = (matches: Match[]) => {
    const alertas: string[] = []
    
    const bajaCompatibilidad = matches.filter(m => m.porcentajeTotal < 30).length
    if (bajaCompatibilidad > 0) {
      alertas.push(`${bajaCompatibilidad} matches con compatibilidad muy baja (<30%)`)
    }

    const sinBuenosMatches = matches.filter(m => m.porcentajeTotal < 40).length
    if (sinBuenosMatches > matches.length * 0.5) {
      alertas.push(`Más del 50% de matches tienen compatibilidad baja`)
    }

    return alertas
  }

  const getEstrellas = (valor: number) => {
    const estrellas = Math.round(valor / 20)
    return "⭐".repeat(estrellas)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* SECCIÓN 1 - Calcular Todos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">🧪 Test del Algoritmo Completo</CardTitle>
            <p className="text-gray-600 mt-2">
              Calcula todos los matches posibles para verificar el funcionamiento del algoritmo
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button 
                onClick={calcularMatches}
                disabled={loading}
                className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3"
              >
                {loading ? "Calculando..." : "Calcular Matches de Todos"}
              </Button>
              
              {resultado && (
                <Button 
                  onClick={limpiarMatches}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  🗑️ Limpiar Matches
                </Button>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md">
                <p className="font-bold">Error:</p>
                <p>{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* SECCIÓN 2 - Resultados */}
        {resultado && resultado.matches && (
          <>
            {/* Resumen Ejecutivo */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">📊 Resumen Ejecutivo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Matches Generados</p>
                    <p className="text-3xl font-bold text-blue-600">{resultado.totalMatches}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Participantes</p>
                    <p className="text-3xl font-bold text-green-600">{resultado.totalParticipantes}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Promedio</p>
                    <p className="text-3xl font-bold text-purple-600">{resultado.promedioCompatibilidad}%</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Rango</p>
                    <p className="text-xl font-bold text-orange-600">
                      {Math.min(...resultado.matches.map(m => m.porcentajeTotal))}% - {Math.max(...resultado.matches.map(m => m.porcentajeTotal))}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top 5 Matches */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">🏆 Top 5 Mejores Matches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {resultado.matches
                    .sort((a, b) => b.porcentajeTotal - a.porcentajeTotal)
                    .slice(0, 5)
                    .map((match, idx) => (
                      <div key={match.id} className="flex items-center justify-between bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg">
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-bold text-gray-400">#{idx + 1}</span>
                          <div>
                            <p className="font-semibold">
                              {match.participanteA.nombre} {match.participanteA.apellidos} 
                              <span className="mx-2">💕</span>
                              {match.participanteB.nombre} {match.participanteB.apellidos}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-pink-600">{match.porcentajeTotal}%</p>
                          {match.porcentajeTotal >= 70 && <span className="text-xl">❤️</span>}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Alertas */}
            {getAlertas(resultado.matches).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">⚠️ Alertas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {getAlertas(resultado.matches).map((alerta, idx) => (
                      <div key={idx} className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                        <p className="text-yellow-800">• {alerta}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Distribución */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">📊 Distribución de Compatibilidad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(getDistribucion(resultado.matches)).map(([rango, cantidad]) => (
                    <div key={rango} className="flex items-center gap-4">
                      <span className="w-24 font-semibold">{rango}:</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-pink-400 to-purple-500 h-full flex items-center px-3 text-white font-semibold"
                          style={{ width: `${(cantidad / resultado.matches.length) * 100}%` }}
                        >
                          {cantidad > 0 && `${cantidad} matches`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* SECCIÓN 3 - Match Manual */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">🎯 Calculadora de Match Manual</CardTitle>
            <p className="text-gray-600 mt-2">
              Calcula la compatibilidad entre dos participantes específicos
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Participante A:</label>
                <Select value={participanteA} onValueChange={setParticipanteA}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar participante" />
                  </SelectTrigger>
                  <SelectContent>
                    {participantes.map(p => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.nombre} {p.apellidos}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Participante B:</label>
                <Select value={participanteB} onValueChange={setParticipanteB}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar participante" />
                  </SelectTrigger>
                  <SelectContent>
                    {participantes.map(p => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.nombre} {p.apellidos}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={calcularMatchManual}
              disabled={loadingManual || !participanteA || !participanteB}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {loadingManual ? "Calculando..." : "Calcular Compatibilidad"}
            </Button>

            {/* Resultado Match Manual */}
            {matchManual && (
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-300 p-6 rounded-lg space-y-4">
                <div className="text-center">
                  <p className="text-xl font-semibold">
                    {matchManual.participanteA.nombre} {matchManual.participanteA.apellidos}
                    <span className="mx-3 text-2xl">💕</span>
                    {matchManual.participanteB.nombre} {matchManual.participanteB.apellidos}
                  </p>
                  <p className="text-5xl font-bold text-pink-600 mt-4">
                    {matchManual.porcentajeTotal}%
                    {matchManual.porcentajeTotal >= 70 && <span className="ml-2">❤️</span>}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">COMPATIBILIDAD TOTAL</p>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-bold mb-3">📊 Desglose por Categorías:</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Estilo de Vida:</span>
                      <span className="font-bold">{matchManual.estiloVida}/100 {getEstrellas(matchManual.estiloVida)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Objetivos:</span>
                      <span className="font-bold">{matchManual.objetivos}/100 {getEstrellas(matchManual.objetivos)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Física/Sexual:</span>
                      <span className="font-bold">{matchManual.fisica}/100 {getEstrellas(matchManual.fisica)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Intelectual:</span>
                      <span className="font-bold">{matchManual.intelectual}/100 {getEstrellas(matchManual.intelectual)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Factores Descarte:</span>
                      <span className="font-bold">{matchManual.descarte}/100 {getEstrellas(matchManual.descarte)}</span>
                    </div>
                  </div>
                </div>

                {matchManual.coincidencias && matchManual.coincidencias.length > 0 && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-bold mb-2 text-green-800">✅ Coincidencias:</h4>
                    <ul className="space-y-1">
                      {matchManual.coincidencias.map((c: string, idx: number) => (
                        <li key={idx} className="text-sm text-green-700">• {c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {matchManual.diferencias && matchManual.diferencias.length > 0 && (
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-bold mb-2 text-orange-800">⚠️ Diferencias:</h4>
                    <ul className="space-y-1">
                      {matchManual.diferencias.map((d: string, idx: number) => (
                        <li key={idx} className="text-sm text-orange-700">• {d}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
