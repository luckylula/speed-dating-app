import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = "admin@speeddating.com"
  const password = "admin123"
  const nombre = "Admin"
  const apellidos = "Sistema"

  // Verificar si ya existe
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    // Si existe, hacerlo admin
    await prisma.user.update({
      where: { email },
      data: { rol: "admin" }
    })
    console.log(`✅ Usuario ${email} actualizado a ADMIN`)
  } else {
    // Si no existe, crearlo como admin
    const hashedPassword = await bcrypt.hash(password, 10)
    
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nombre,
        apellidos,
        rol: "admin"
      }
    })
    
    console.log(`✅ Usuario ADMIN creado exitosamente`)
    console.log(`📧 Email: ${email}`)
    console.log(`🔑 Password: ${password}`)
  }
}

main()
  .catch((e) => {
    console.error("❌ Error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })