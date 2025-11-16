import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "./prisma"
import { cookies } from "next/headers"

export async function verificarAdmin() {
  try {
    // Obtener la sesión con las cookies
    const cookieStore = await cookies()
    const session = await getServerSession(authOptions)
    
    console.log("🔍 Verificando admin - Session:", JSON.stringify(session, null, 2))
    
    if (!session || !session.user?.email) {
      console.log("❌ No hay sesión o email")
      return { esAdmin: false, usuario: null }
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, email: true, nombre: true, rol: true }
    })

    console.log("👤 Usuario encontrado:", user)
    console.log("🔑 Rol del usuario:", user?.rol)

    const esAdmin = user?.rol === "admin"
    console.log("✅ Es admin?", esAdmin)

    return { esAdmin, usuario: user }
  } catch (error) {
    console.error("❌ Error en verificarAdmin:", error)
    return { esAdmin: false, usuario: null }
  }
}