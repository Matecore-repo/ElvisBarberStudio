"use client"

/**
 * Skeleton loader para simular carga de contenido
 */
export function SkeletonCard() {
  return (
    <div className="p-6 border border-border rounded-xl bg-card/20 animate-pulse">
      <div className="space-y-4">
        <div className="h-4 bg-card/60 rounded w-1/2" />
        <div className="h-8 bg-card/60 rounded w-3/4" />
        <div className="h-4 bg-card/60 rounded w-2/3" />
      </div>
    </div>
  )
}

export function SkeletonCardGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export function SkeletonTable() {
  return (
    <div className="w-full border border-border rounded-xl overflow-hidden bg-card/20">
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-card/40">
              {Array.from({ length: 5 }).map((_, i) => (
                <th key={i} className="px-6 py-4">
                  <div className="h-4 bg-card/60 rounded w-20 animate-pulse" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-border">
                {Array.from({ length: 5 }).map((_, j) => (
                  <td key={j} className="px-6 py-4">
                    <div className="h-4 bg-card/60 rounded animate-pulse" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards skeleton */}
      <div className="sm:hidden space-y-3 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4 border border-border rounded-lg bg-card/40 space-y-3 animate-pulse">
            <div className="h-4 bg-card/60 rounded w-1/2" />
            <div className="h-4 bg-card/60 rounded w-3/4" />
            <div className="h-4 bg-card/60 rounded w-2/3" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function SkeletonText({ width = 'w-3/4' }: { width?: string }) {
  return <div className={`h-4 bg-card/60 rounded ${width} animate-pulse`} />
}

export function SkeletonHeader() {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="h-8 bg-card/60 rounded w-1/3" />
      <div className="h-4 bg-card/60 rounded w-1/2" />
    </div>
  )
}
