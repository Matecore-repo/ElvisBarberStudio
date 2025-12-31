import { prisma } from "@/lib/prisma"
import { BarbersList } from "@/components/barbers/BarbersList"

export default async function BarbersPage() {
    const barbers = await prisma.barber.findMany({
        orderBy: { createdAt: "desc" }
    }).catch(() => [])

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Peluqueros</h1>
                <p className="text-foreground-muted mt-1">Gestiona tu equipo y comisiones</p>
            </div>

            <BarbersList initialBarbers={barbers} />
        </div>
    )
}
