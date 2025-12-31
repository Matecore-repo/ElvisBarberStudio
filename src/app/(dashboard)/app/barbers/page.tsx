import { Suspense } from "react"
import { getCachedBarbers } from "@/lib/prisma"
import { BarbersList } from "@/components/barbers/BarbersList"
import { SkeletonTable } from "@/components/dashboard/SkeletonLoaders"
import { auth } from "@/auth"

export default async function BarbersPage() {
    const session = await auth()
    const salonId = session?.user?.salonId || "default"
    
    const barbers = await getCachedBarbers(salonId).catch(() => [])

    // Convertir Decimal a número para serializar al cliente
    const barbersForClient = barbers.map(barber => ({
        ...barber,
        commissionValue: parseFloat(barber.commissionValue.toString())
    }))

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Peluqueros</h1>
                <p className="text-foreground-muted mt-1">Gestiona tu equipo y comisiones</p>
            </div>

            <Suspense fallback={<SkeletonTable />}>
                <BarbersList initialBarbers={barbersForClient} />
            </Suspense>
        </div>
    )
}
