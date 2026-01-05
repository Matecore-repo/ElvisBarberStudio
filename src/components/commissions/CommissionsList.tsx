"use client"

import { useMemo, useState } from "react"
import { Commission, Barber, Appointment, Client, Service } from "@prisma/client"
import { DataTable } from "@/components/dashboard/DataTable"

interface ServiceSerialized extends Omit<Service, 'price'> {
  price: number
}

interface AppointmentSerialized extends Omit<Appointment, 'totalAmount'> {
  totalAmount: number | null
}

interface CommissionSerialized extends Omit<Commission, 'amount'> {
  amount: number
}

interface BarberSerialized extends Omit<Barber, 'commissionValue'> {
  commissionValue: number
}

type CommissionWithRelations = CommissionSerialized & {
  barber: BarberSerialized
  appointment: (AppointmentSerialized & {
    client: Client | null
    service: ServiceSerialized | null
  }) | null
}

interface CommissionsListProps {
  initialCommissions: CommissionWithRelations[]
}

export function CommissionsList({ initialCommissions }: CommissionsListProps) {
  const [commissions, setCommissions] = useState<CommissionWithRelations[]>(initialCommissions)
  const [loading, setLoading] = useState<string | null>(null)

  const totalPending = useMemo(() => {
    return commissions
      .filter((c) => c.status === "PENDING")
      .reduce((sum, c) => sum + c.amount, 0)
  }, [commissions])

  const handlePay = async (id: string) => {
    setLoading(id)

    try {
      const res = await fetch(`/api/commissions/${id}/pay`, { method: "POST" })
      if (!res.ok) return
      setCommissions(commissions.map((c) => (c.id === id ? { ...c, status: "PAID" as const } : c)))
    } catch (error) {
      console.error("Error paying commission:", error)
    } finally {
      setLoading(null)
    }
  }

  const filters = [
    {
      key: "status",
      label: "Estado",
      options: [
        { value: "PENDING", label: "Pendiente" },
        { value: "PAID", label: "Pagada" },
      ],
    },
  ]

  return (
    <div className="space-y-8">
      {/* Summary Card */}
      <div className="card bg-accent/10 border-accent/20">
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="text-foreground-muted text-sm">Total pendiente de pago</p>
            <p className="text-4xl font-bold text-accent">${totalPending.toFixed(2)}</p>
          </div>
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-accent/15 flex items-center justify-center shrink-0">
            <span className="text-3xl" aria-hidden="true">
              💸
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={[
          {
             
            key: "barber" as keyof CommissionWithRelations,
            label: "Peluquero",
            searchable: true,
            sortable: true,
            render: (_, commission: CommissionWithRelations) => commission.barber.name,
          },
          {
             
            key: "appointment" as keyof CommissionWithRelations,
            label: "Cliente",
            searchable: true,
            sortable: true,
            render: (_, commission: CommissionWithRelations) => commission.appointment?.client?.name || "Sin cliente",
          },
          {
             
            key: "appointment" as keyof CommissionWithRelations,
            label: "Servicio",
            searchable: true,
            sortable: true,
            render: (_, commission: CommissionWithRelations) => commission.appointment?.service?.name || "Sin servicio",
          },
          {
            key: "amount",
            label: "Monto",
            align: "right",
            sortable: true,
            render: (value) => `$${parseFloat(String(value)).toFixed(2)}`,
          },
          {
            key: "createdAt",
            label: "Fecha",
            sortable: true,
            render: (value) => value ? new Date(value as string | Date).toLocaleDateString("es-AR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }) : '-',
          },
          {
            key: "status",
            label: "Estado",
            align: "center",
            render: (value) => (
              <span
                className={`badge ${value === "PENDING" ? "bg-warning/15 text-warning" : "bg-success/15 text-success"
                  }`}
              >
                {value === "PENDING" ? "Pendiente" : "Pagada"}
              </span>
            ),
          },
          {
            key: "id",
            label: "Acción",
            align: "center",
            render: (_, commission: CommissionWithRelations) =>
              commission.status === "PENDING" && (
                <button
                  onClick={() => handlePay(commission.id)}
                  disabled={loading === commission.id}
                  className="btn-primary text-xs py-1 px-3"
                >
                  {loading === commission.id ? "..." : "Pagar"}
                </button>
              ),
          },
        ]}
        data={commissions}
        filters={filters}
        searchPlaceholder="Buscar peluquero, cliente o servicio..."
        emptyState={{
          icon: "🧾",
          title: "Sin comisiones",
          description: "No hay comisiones registradas aún.",
        }}
      />
    </div>
  )
}
