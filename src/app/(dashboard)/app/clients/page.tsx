import { prisma } from "@/lib/prisma"
import ClientsComponent from "./clients-component"

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
  }).catch(() => [])

  const clientsForClient = clients.map(client => ({
    ...client,
    id: client.id,
  }))

  return <ClientsComponent initialClients={clientsForClient} />
}
