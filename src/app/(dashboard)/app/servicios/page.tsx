import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { ServicesList } from "@/components/services/ServicesList"

export default async function ServicesPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const salonId = session.user?.salonId || "salon-1"

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Servicios</h1>
        <p className="text-foreground-muted mt-1">Gestiona tu menú de servicios y precios</p>
      </div>
      <ServicesList salonId={salonId} />
    </div>
  )
}
