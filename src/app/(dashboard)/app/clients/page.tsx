export default function ClientsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-foreground-muted mt-1">Base de datos de clientes</p>
        </div>
        <button className="btn-primary w-full sm:w-auto">Nuevo cliente</button>
      </div>

      <div className="card">
        <p className="text-foreground-muted text-center py-10">
          No hay clientes registrados aún.
        </p>
      </div>
    </div>
  )
}

