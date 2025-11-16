"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckboxGroup } from "@/components/forms/CheckboxGroup"
import { RadioGroupCustom } from "@/components/forms/RadioGroupCustom"
import { StepIndicator } from "@/components/forms/StepIndicator"

interface FormData {
  // Datos personales
  nombre: string
  apellidos: string
  edad: string
  genero: string
  residencia: string
  telefono: string
  email: string
  
  // Preguntas obligatorias
  franjaEdad: string[]
  sexualidad: string
  
  // Estilo de vida
  gruposIdentificacion: string[]
  deportes: string[]
  fumador: string
  formaVestir: string[]
  tipoCasa: string[]
  
  // Objetivos relacionales
  queBuscas: string[]
  hijos: string[]
  mascotas: string[]
  valores: string[]
  visionFuturo: string[]
  
  // Compatibilidad física/sexual
  atraccionFisica: string[]
  importanciaSexo: string[]
  queValoras: string[]
  
  // Intelectual/Cultural
  formacion: string[]
  idiomas: string[]
  visionVida: string
  
  // Factores de descarte y otros
  factoresDescarte: string[]
  opinionDrogas: string
  opinionAlcohol: string
  suenos: string[]
}

export default function RegistroPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    apellidos: "",
    edad: "",
    genero: "",
    residencia: "",
    telefono: "",
    email: "",
    franjaEdad: [],
    sexualidad: "",
    gruposIdentificacion: [],
    deportes: [],
    fumador: "",
    formaVestir: [],
    tipoCasa: [],
    queBuscas: [],
    hijos: [],
    mascotas: [],
    valores: [],
    visionFuturo: [],
    atraccionFisica: [],
    importanciaSexo: [],
    queValoras: [],
    formacion: [],
    idiomas: [],
    visionVida: "",
    factoresDescarte: [],
    opinionDrogas: "",
    opinionAlcohol: "",
    suenos: []
  })

  const stepTitles = ["Datos", "Filtros", "Estilo", "Objetivos", "Física", "Cultural", "Revisión"]

  const updateField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateStep = (step: number): boolean => {
    setError("")
    
    switch(step) {
      case 1:
        if (!formData.nombre || !formData.apellidos || !formData.edad || 
            !formData.genero || !formData.email) {
          setError("Por favor completa todos los campos obligatorios")
          return false
        }
        const edad = parseInt(formData.edad)
        if (edad < 18 || edad > 100) {
          setError("La edad debe estar entre 18 y 100 años")
          return false
        }
        return true
        
      case 2:
        if (formData.franjaEdad.length === 0) {
          setError("Selecciona al menos una franja de edad")
          return false
        }
        if (!formData.sexualidad) {
          setError("Selecciona tu orientación sexual")
          return false
        }
        return true
        
      case 3:
        if (formData.gruposIdentificacion.length === 0) {
          setError("Selecciona al menos un grupo de identificación")
          return false
        }
        if (!formData.fumador) {
          setError("Indica si eres fumador/a")
          return false
        }
        return true
        
      case 4:
        if (formData.queBuscas.length === 0) {
          setError("Indica qué buscas en una relación")
          return false
        }
        return true
        
      case 5:
        if (formData.atraccionFisica.length === 0) {
          setError("Selecciona al menos una característica física")
          return false
        }
        return true
        
      case 6:
        if (formData.idiomas.length === 0) {
          setError("Selecciona al menos un idioma")
          return false
        }
        if (!formData.visionVida) {
          setError("Selecciona cómo defines la vida")
          return false
        }
        if (!formData.opinionDrogas) {
          setError("Indica tu opinión sobre las drogas")
          return false
        }
        if (!formData.opinionAlcohol) {
          setError("Indica tu opinión sobre el alcohol")
          return false
        }
        return true
        
      default:
        return true
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 7))
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
    window.scrollTo(0, 0)
  }

  const handleSubmit = async () => {
    if (!validateStep(6)) return
    
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al guardar el formulario")
      }

      // Redirigir al dashboard
      router.push("/dashboard?registered=true")
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // OPCIONES PARA LOS CAMPOS
  const opciones = {
    genero: ["HOMBRE", "MUJER", "SIN GENERO"],
    franjaEdad: [
      "DE 18 A 25 AÑOS",
      "DE 25 A 30 AÑOS",
      "DE 30 A 40 AÑOS",
      "DE 40 A 50 AÑOS",
      "DE 50 A 65 AÑOS",
      "DE 65 AÑOS A 100 AÑOS"
    ],
    sexualidad: ["HETEROSEXUAL", "HOMOSEXUAL", "BISEXUAL"],
    grupos: [
      "DEPORTISTAS",
      "FIESTER@S",
      "INTELECTUAL",
      "VIAJER@",
      "ARTISTA",
      "FESTIVALER@",
      "CASER@",
      "BAILARIN/A",
      "FURGONETERO@",
      "COCINILLAS",
      "YOGUI Y MUNDO MEDITACION",
      "GAMER",
      "MUSICO"
    ],
    deportes: [
      "RUNNER",
      "SURFER@",
      "SKIADOR / SNOWBOARDER",
      "SENDERISMO / TREKKING",
      "SKATER",
      "CICLISMO/BTT",
      "DEPORTES DE RAQUETA",
      "FUTBOLER@",
      "GOLF",
      "FITNESS/ GYM/ CROSSFIT",
      "DEPORTES ACUATICOS: PADDLE SURF/KAYAK",
      "VOLEY",
      "BASKET",
      "PARACAIDISMO / PARAPENTE / ALADELTA",
      "MUNDO NAUTICO",
      "SUBMARINISMO/SNORKEL",
      "TRIATLON",
      "SOFFING"
    ],
    fumador: ["NO FUMADOR/A", "FUMADOR/A", "LO ESTOY DEJANDO"],
    queBuscas: [
      "RELACION ESTABLE",
      "CONOCER GENTE PARA HACER PLANES",
      "HACER NUEVOS AMIG@S",
      "TENER SEXO OCASIONAL SIN COMPROMISO",
      "RELACION SIN COMPROMISO",
      "LO QUE SURJA",
      "QUE LA VIDA ME SORPRENDA",
      "RELACION ABIERTA"
    ],
    hijos: [
      "SI",
      "NO",
      "ME GUSTARIA TENER",
      "NO QUIERO! ESTOY GENIAL ASI!",
      "ME GUSTARIA ADOPTAR",
      "NO TENGO, PERO NO ME IMPORTARIA QUE MI PAREJA TUVIERA"
    ],
    mascotas: [
      "SI",
      "NO",
      "ME ENCANTARIA TENER",
      "NO TENGO NI QUIERO!",
      "NO TENGO, PERO NO ME IMPORTARIA QUE MI PAREJA TUVIERA"
    ],
    formacion: [
      "ESTUDIOS BASICOS",
      "FORMACION PROFESIONAL",
      "DIPLOMATURA",
      "LICENCIATURA",
      "DOCTORADO",
      "MASTER",
      "ESCUELA DE LA VIDA",
      "AUTONOMO",
      "EMPRESARI@",
      "EMPRENDEDOR/A",
      "ADICT@ A MI TRABAJO"
    ],
    valores: [
      "DIVERSION",
      "LEALTAD",
      "RISAS",
      "FIDELIDAD",
      "ESTABILIDAD",
      "FELICIDAD",
      "COMPAÑÍA",
      "PASION",
      "LIBERTAD",
      "SEA CARIÑOS@ Y ATENT@",
      "EMPATIA",
      "DETALLISTA"
    ],
    visionFuturo: [
      "VIVIENDO CON MI PAREJA",
      "VIAJANDO POR EL MUNDO EN PAREJA",
      "FORMANDO UNA FAMILIA",
      "CON VARIAS PAREJAS CON LAS QUE DIVERTIRME",
      "LIBRE COMO UN PAJARO",
      "CREANDO UN PROYECTO EN PAREJA"
    ],
    idiomas: [
      "CASTELLANO",
      "CATALAN",
      "EUSKERA",
      "GALEGO",
      "INGLES",
      "FRANCES",
      "ITALIANO",
      "ALEMAN",
      "HABLO MAS DE 4 IDIOMAS"
    ],
    queValoras: [
      "BUENA CONVERSACION",
      "RISAS",
      "BUEN SEXO",
      "LIBERTAD",
      "QUE NO SEA CELOS@",
      "COMPARTIR AFICIONES",
      "IMPLICACION Y DEDICACION",
      "QUE SEA CARIÑOS@",
      "SEA LEAL Y BUENA PERSONA",
      "PAZ MENTAL",
      "CUMPLA MIS FANTASIAS SEXUALES"
    ],
    atraccionFisica: [
      "OJOS CLAROS",
      "OJOS OSCUROS",
      "PELO LARGO",
      "PELO RIZADO",
      "CUERPO MUSCULAD@S",
      "CUERPO CORPULENT@S",
      "CUERPO DELGAD@S",
      "SONRISA",
      "FORMA DE VESTIR",
      "LABIOS",
      "QUE SEA COMO SEA, SE CUIDE!",
      "QUE SEA SEXY Y SENSUAL",
      "FORMA DE HABLAR Y COMUNICARSE",
      "TATUAJES",
      "PIERCINGS"
    ],
    factoresDescarte: [
      "CELOS",
      "FUMADOR/A",
      "INFIDELIDAD",
      "TENER HIJOS O CARGAS FAMILIARES",
      "QUERER UNA RELACION ESTABLE",
      "FALSEDAD",
      "LA MENTIRA",
      "FALTA DE ATENCION"
    ],
    formaVestir: [
      "CASUAL",
      "DEPORTIV@",
      "A LA MODA",
      "ELEGANTE",
      "FASHION",
      "TRENDY",
      "NO ME IMPORTA",
      "MI PROPIA MODA",
      "LAS MARCAS ME FLIPAN!"
    ],
    importanciaSexo: [
      "ES FUNDAMENTAL PARA QUE FUNCIONE LA RELACION",
      "PREFIERO OTRAS CUALIDADES EN MI PAREJA",
      "MEJOR CALIDAD, QUE CANTIDAD",
      "NO ME GUSTA QUE ME AGOBIEN!",
      "CUANTO MAS MEJOR!",
      "ME ENCANTA INNOVAR Y FANTASEAR",
      "SOY MUY ORIGINAL",
      "CALIDAD Y CANTIDAD IMPRESCINDIBLE",
      "ME GUSTA EL SEXO DURO",
      "CON CARIÑO Y AMOR"
    ],
    tipoCasa: [
      "COMPARTO CON MAS GENTE",
      "VIVO CON MI FAMILIA",
      "HOGAREÑA",
      "MODERNA",
      "EN EL CAMPO",
      "CERCA DEL MAR",
      "SOLITARIA",
      "MINIMALISTA",
      "URBANITA"
    ],
    suenos: [
      "DAR LA VUELTA AL MUNDO",
      "NADAR CON DELFINES Y BALLENAS",
      "VOLAR EN PARACAIDAS",
      "IR AL ESPACIO",
      "TENER UNA CASA EN LA PLAYA",
      "CONOCER A MI ARTISTA FAVORITO",
      "QUE ME COCINE UN FAMOSO CHEF",
      "PILOTAR UN AVION",
      "TENER UN DEPORTIVO",
      "CREAR UN NEGOCIO MILLONARIO",
      "HACER UN SAFARI EN AFRICA",
      "AYUDAR EN UNA ONG"
    ],
    opinionDrogas: [
      "NO LAS CONSUMO",
      "CONSUMO DE FORMA ESPORADICA",
      "CONSUMO HABITUALMENTE",
      "ESTOY A FAVOR PERO NO LAS CONSUMO",
      "ESTOY EN CONTRA Y NO LAS QUIERO!"
    ],
    opinionAlcohol: [
      "NO BEBO",
      "BEBO DE FORMA ESPORADICA",
      "BEBO HABITUALMENTE",
      "NO ME PARECE MAL QUE OTROS BEBAN, PERO YO NO BEBO",
      "ESTOY EN CONTRA Y NO PREFIERO RODEARME DE ABSTEMIOS"
    ],
    visionVida: [
      "UN VIAJE QUE TOCA DISFRUTARLO AL MAXIMO",
      "UN BUEN LIBRO CON INCIO Y FIN, Y QUE YO MISMO PUEDO REESCRIBIR",
      "UNA PELICULA EN LA QUE YO QUIERO SER EL GUIONISTA Y PROTAGONISTA PRINCIPAL",
      "UNA TORMENTA EN MEDIO DEL MAR, EN LA QUE NO TE QUEDA OTRA QUE APRENDER A NAVEGAR",
      "UN TREN QUE PASA... SI NO TE SUBES A TIEMPO...",
      "DIA A DIA, UN APRENDIZAJE CONTINUO"
    ]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-center">
              Formulario de Registro - Speed Dating
            </CardTitle>
            <p className="text-center text-gray-600 mt-2">
              Completa el cuestionario para encontrar tu match perfecto
            </p>
          </CardHeader>
          <CardContent>
            <StepIndicator 
              currentStep={currentStep} 
              totalSteps={7}
              stepTitles={stepTitles}
            />

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-6">
                {error}
              </div>
            )}

            <div className="space-y-6">
              {/* PASO 1: DATOS PERSONALES */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-pink-600">Datos Personales</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Nombre *</Label>
                      <Input
                        value={formData.nombre}
                        onChange={(e) => updateField("nombre", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label>Apellidos *</Label>
                      <Input
                        value={formData.apellidos}
                        onChange={(e) => updateField("apellidos", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Edad *</Label>
                      <Input
                        type="number"
                        value={formData.edad}
                        onChange={(e) => updateField("edad", e.target.value)}
                        min="18"
                        max="100"
                        required
                      />
                    </div>
                    <div>
                      <RadioGroupCustom
                        label="Género"
                        options={opciones.genero}
                        selected={formData.genero}
                        onChange={(value) => updateField("genero", value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Residencia</Label>
                    <Input
                      value={formData.residencia}
                      onChange={(e) => updateField("residencia", e.target.value)}
                      placeholder="Ciudad"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Teléfono</Label>
                      <Input
                        type="tel"
                        value={formData.telefono}
                        onChange={(e) => updateField("telefono", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PASO 2: FILTROS OBLIGATORIOS */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-pink-600">Filtros Obligatorios</h2>
                  <p className="text-sm text-gray-600">
                    Estas respuestas son fundamentales para el matching. Deben coincidir para que haya compatibilidad.
                  </p>
                  
                  <CheckboxGroup
                    label="¿Qué franja de edad buscas en tu pareja?"
                    options={opciones.franjaEdad}
                    selected={formData.franjaEdad}
                    onChange={(values) => updateField("franjaEdad", values)}
                    required
                  />

                  <RadioGroupCustom
                    label="Orientación Sexual"
                    options={opciones.sexualidad}
                    selected={formData.sexualidad}
                    onChange={(value) => updateField("sexualidad", value)}
                    required
                  />
                </div>
              )}

              {/* PASO 3: ESTILO DE VIDA */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-pink-600">Estilo de Vida</h2>
                  
                  <CheckboxGroup
                    label="¿En qué grupo te ves reflejad@?"
                    options={opciones.grupos}
                    selected={formData.gruposIdentificacion}
                    onChange={(values) => updateField("gruposIdentificacion", values)}
                    required
                  />

                  {formData.gruposIdentificacion.includes("DEPORTISTAS") && (
                    <CheckboxGroup
                      label="¿Qué deportes practicas?"
                      options={opciones.deportes}
                      selected={formData.deportes}
                      onChange={(values) => updateField("deportes", values)}
                    />
                  )}

                  <RadioGroupCustom
                    label="¿Eres fumador/a?"
                    options={opciones.fumador}
                    selected={formData.fumador}
                    onChange={(value) => updateField("fumador", value)}
                    required
                  />

                  <CheckboxGroup
                    label="¿Cómo defines tu forma de vestir?"
                    options={opciones.formaVestir}
                    selected={formData.formaVestir}
                    onChange={(values) => updateField("formaVestir", values)}
                  />

                  <CheckboxGroup
                    label="¿Cómo es tu casa?"
                    options={opciones.tipoCasa}
                    selected={formData.tipoCasa}
                    onChange={(values) => updateField("tipoCasa", values)}
                  />
                </div>
              )}

              {/* PASO 4: OBJETIVOS RELACIONALES */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-pink-600">Objetivos Relacionales</h2>
                  
                  <CheckboxGroup
                    label="¿Qué buscas en una relación?"
                    options={opciones.queBuscas}
                    selected={formData.queBuscas}
                    onChange={(values) => updateField("queBuscas", values)}
                    required
                  />

                  <CheckboxGroup
                    label="¿Tienes hijos?"
                    options={opciones.hijos}
                    selected={formData.hijos}
                    onChange={(values) => updateField("hijos", values)}
                  />

                  <CheckboxGroup
                    label="¿Tienes mascotas?"
                    options={opciones.mascotas}
                    selected={formData.mascotas}
                    onChange={(values) => updateField("mascotas", values)}
                  />

                  <CheckboxGroup
                    label="¿Qué valores quieres en una relación?"
                    options={opciones.valores}
                    selected={formData.valores}
                    onChange={(values) => updateField("valores", values)}
                  />

                  <CheckboxGroup
                    label="¿Cómo te ves en un futuro?"
                    options={opciones.visionFuturo}
                    selected={formData.visionFuturo}
                    onChange={(values) => updateField("visionFuturo", values)}
                  />
                </div>
              )}

              {/* PASO 5: COMPATIBILIDAD FÍSICA/SEXUAL */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-pink-600">Compatibilidad Física y Sexual</h2>
                  
                  <CheckboxGroup
                    label="¿Qué físico es el que te atrae?"
                    options={opciones.atraccionFisica}
                    selected={formData.atraccionFisica}
                    onChange={(values) => updateField("atraccionFisica", values)}
                    required
                  />

                  <CheckboxGroup
                    label="¿Qué valoras en una relación?"
                    options={opciones.queValoras}
                    selected={formData.queValoras}
                    onChange={(values) => updateField("queValoras", values)}
                  />

                  <CheckboxGroup
                    label="¿Qué importancia le das al sexo en una relación?"
                    options={opciones.importanciaSexo}
                    selected={formData.importanciaSexo}
                    onChange={(values) => updateField("importanciaSexo", values)}
                  />
                </div>
              )}

              {/* PASO 6: INTELECTUAL/CULTURAL Y DESCARTE */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-pink-600">Compatibilidad Intelectual y Factores de Descarte</h2>
                  
                  <CheckboxGroup
                    label="¿Qué formación tienes?"
                    options={opciones.formacion}
                    selected={formData.formacion}
                    onChange={(values) => updateField("formacion", values)}
                  />

                  <CheckboxGroup
                    label="¿Cuántos idiomas hablas?"
                    options={opciones.idiomas}
                    selected={formData.idiomas}
                    onChange={(values) => updateField("idiomas", values)}
                    required
                  />

                  <CheckboxGroup
                    label="¿Qué factores te hacen descartar una relación?"
                    options={opciones.factoresDescarte}
                    selected={formData.factoresDescarte}
                    onChange={(values) => updateField("factoresDescarte", values)}
                  />

                  <CheckboxGroup
                    label="¿Qué sueño te gustaría cumplir en tu vida?"
                    options={opciones.suenos}
                    selected={formData.suenos}
                    onChange={(values) => updateField("suenos", values)}
                  />

                  <RadioGroupCustom
                    label="¿Qué opinas de las drogas?"
                    options={opciones.opinionDrogas}
                    selected={formData.opinionDrogas}
                    onChange={(value) => updateField("opinionDrogas", value)}
                    required
                  />

                  <RadioGroupCustom
                    label="¿Qué opinas del alcohol?"
                    options={opciones.opinionAlcohol}
                    selected={formData.opinionAlcohol}
                    onChange={(value) => updateField("opinionAlcohol", value)}
                    required
                  />

                  <RadioGroupCustom
                    label="¿Cómo definirías la vida?"
                    options={opciones.visionVida}
                    selected={formData.visionVida}
                    onChange={(value) => updateField("visionVida", value)}
                    required
                  />
                </div>
              )}

              {/* PASO 7: REVISIÓN */}
              {currentStep === 7 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-pink-600">Revisión Final</h2>
                  <p className="text-sm text-gray-600">
                    Por favor revisa tus respuestas antes de enviar. Puedes volver atrás para hacer cambios.
                  </p>
                  
                  <div className="bg-pink-50 p-6 rounded-lg space-y-4">
                    <div>
                      <h3 className="font-semibold">Datos Personales:</h3>
                      <p>{formData.nombre} {formData.apellidos}, {formData.edad} años</p>
                      <p>{formData.email}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold">Buscas:</h3>
                      <p>{formData.franjaEdad.join(", ")}</p>
                      <p>Orientación: {formData.sexualidad}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold">Te identificas con:</h3>
                      <p>{formData.gruposIdentificacion.join(", ")}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold">En una relación buscas:</h3>
                      <p>{formData.queBuscas.join(", ")}</p>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
                    <p className="text-sm text-yellow-800">
                      ⚠️ Una vez enviado, tus respuestas serán procesadas por nuestro algoritmo de matching. 
                      Asegúrate de que toda la información sea correcta.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* BOTONES DE NAVEGACIÓN */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                ← Anterior
              </Button>

              {currentStep < 7 ? (
                <Button onClick={nextStep} className="bg-pink-600 hover:bg-pink-700">
                  Siguiente →
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? "Enviando..." : "Enviar Formulario ✓"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}