import { Suspense } from "react"
import { SkeletonTable } from "@/components/dashboard/SkeletonLoaders"
import { SalonsList } from "@/components/salons/SalonsList"

export default function SalonsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Sucursales</h1>
        <p className="text-foreground-muted mt-1">Gestiona ubicaciones y contactos</p>
      </div>
      <Suspense fallback={<SkeletonTable />}>
        <SalonsList />
      </Suspense>
    </div>
  )
}
