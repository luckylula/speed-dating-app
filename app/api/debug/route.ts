import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        nombre: true,
        rol: true
      }
    })

    const dbUrl = process.env.DATABASE_URL?.substring(0, 50) + "..."

    return NextResponse.json({
      success: true,
      database: dbUrl,
      userCount: users.length,
      users: users,
      message: "Prisma conectado correctamente"
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      database: process.env.DATABASE_URL?.substring(0, 50) + "..."
    }, { status: 500 })
  }
}
```

**Commit changes**

---

## ⏱️ DESPUÉS DEL DEPLOYMENT:

**Abre:**
```
https://speed-dating-app-two.vercel.app/api/debug
