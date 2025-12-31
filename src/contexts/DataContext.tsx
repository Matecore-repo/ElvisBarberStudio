"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export interface Service {
  id: string
  name: string
  description?: string // Optional now as DB might not have it
  price: number | string
  durationMinutes: number
  categoryId: string | null
  category?: {
    id: string
    name: string
  } | null
}

export interface Salon {
  id: string
  name: string
  address: string | null
  phone: string | null
}

interface DataContextType {
  services: Service[]
  salons: Salon[]
  loading: boolean
  refreshData: () => Promise<void>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [services, setServices] = useState<Service[]>([])
  const [salons, setSalons] = useState<Salon[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [servicesRes, salonsRes] = await Promise.all([
        fetch("/api/services?limit=100"),
        fetch("/api/salons") // Assuming this endpoint exists, or we might need to create it
      ])

      if (servicesRes.ok) {
        const data = await servicesRes.json()
        setServices(data.data || [])
      }

      // If salons endpoint doesn't exist yet, we might want to keep the hardcode or handle it gracefully
      // but assuming we want full sync:
      if (salonsRes.ok) {
        const data = await salonsRes.json()
        setSalons(data.data || [])
      } else {
        // Fallback for salons if API not ready, to avoid breaking the UI completely
        setSalons([
          { id: "1", name: "Sucursal Centro", address: "Av. Rivadavia 2222", phone: "+541132975792" },
          { id: "2", name: "Sucursal Recoleta", address: "Viamonte 2600", phone: "+541138326831" },
        ])
      }

    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <DataContext.Provider value={{ services, salons, loading, refreshData: fetchData }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
