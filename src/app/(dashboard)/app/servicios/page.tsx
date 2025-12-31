import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { ServicesList } from "@/components/services/ServicesList"

export default async function ServicesPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const salonId = session.user?.salonId || "salon-1"

  return <ServicesList salonId={salonId} />
}
