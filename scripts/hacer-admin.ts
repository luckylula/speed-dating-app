import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2]
  
  if (!email) {
    console.error("❌ Debes proporcionar un email")
    console.log("Uso: npm run make-admin tu_email@ejemplo.com")
    process.exit(1)
  }

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    console.error(`❌ No se encontró ningún usuario con el email: ${email}`)
    process.exit(1)
  }

  await prisma.user.update({
    where: { email },
    data: { rol: "admin" }
  })

  console.log(`✅ Usuario ${email} ahora es ADMINISTRADOR`)
}

main()
  .catch((e) => {
    console.error("❌ Error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })