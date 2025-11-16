"use client"

import { Suspense } from "react"
import DashboardContent from "./DashboardContent"

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Cargando...</div>}>
      <DashboardContent />
    </Suspense>
  )
}