import { Suspense } from "react"
import { SkeletonTable } from "@/components/dashboard/SkeletonLoaders"
import { SalonsList } from "@/components/salons/SalonsList"

export default function SalonsPage() {
  return (
    <div className="space-y-8">
      <Suspense fallback={<SkeletonTable />}>
        <SalonsList />
      </Suspense>
    </div>
  )
}
