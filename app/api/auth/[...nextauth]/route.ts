import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("🔍 Intentando login con:", credentials?.email)
        
        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Credenciales incompletas")
          throw new Error("Credenciales incompletas")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        console.log("👤 Usuario encontrado:", user ? "SÍ" : "NO")
        console.log("📧 Email buscado:", credentials.email)
        
        if (!user) {
          console.log("❌ Usuario no encontrado en BD")
          throw new Error("Usuario no encontrado")
        }

        console.log("🔐 Hash en BD:", user.password.substring(0, 20) + "...")
        
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        console.log("🔑 Password válido:", isPasswordValid)

        if (!isPasswordValid) {
          console.log("❌ Contraseña incorrecta")
          throw new Error("Contraseña incorrecta")
        }

        console.log("✅ Login exitoso para:", user.email)
        
        return {
          id: user.id,
          email: user.email,
          name: user.nombre,
          rol: user.rol
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.rol = (user as any).rol
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).rol = token.rol as string
        (session.user as any).id = token.id as string
      }
      return session
    }
  },
  pages: {
    signIn: "/login"
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }