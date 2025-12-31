"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export interface Service {
  id: string
  name: string
  description: string
  price: number
  category: "Cortes" | "Barba"
}

export interface Salon {
  id: string
  name: string
  address: string
  phone: string | null
}

interface DataContextType {
  services: Service[]
  salons: Salon[]
  updateServices: (services: Service[]) => void
  updateSalons: (salons: Salon[]) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [services, setServices] = useState<Service[]>([])
  const [salons, setSalons] = useState<Salon[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const savedServices = localStorage.getItem("elvisBarber_services")
    const savedSalons = localStorage.getItem("elvisBarber_salons")

    let loadedServices: Service[] = []
    let loadedSalons: Salon[] = []

    if (savedServices) {
      loadedServices = JSON.parse(savedServices)
    } else {
      loadedServices = [
        { id: "1", name: "Corte Clásico", description: "Tijera o máquina, lavado incluido", price: 2500, category: "Cortes" },
        { id: "2", name: "Skin Fade", description: "Degradado perfecto a navaja", price: 3000, category: "Cortes" },
        { id: "3", name: "Corte Infantil", description: "Menores de 12 años", price: 2000, category: "Cortes" },
        { id: "4", name: "Perfilado Express", description: "Solo máquina, sin toalla", price: 1500, category: "Barba" },
        { id: "5", name: "Ritual de Barba", description: "Toalla caliente, aceites, navaja", price: 2200, category: "Barba" },
        { id: "6", name: "Afeitado Tradicional", description: "Navaja completa, masaje facial", price: 2500, category: "Barba" },
      ]
      localStorage.setItem("elvisBarber_services", JSON.stringify(loadedServices))
    }

    if (savedSalons) {
      loadedSalons = JSON.parse(savedSalons)
    } else {
      loadedSalons = [
        { id: "1", name: "Sucursal Centro", address: "Av. Rivadavia 2222", phone: "+541132975792" },
        { id: "2", name: "Sucursal Recoleta", address: "Viamonte 2600", phone: "+541138326831" },
        { id: "3", name: "Sucursal Caballito", address: "Av. Iriarte 2847", phone: "+541169714636" },
        { id: "4", name: "Sucursal Flores", address: "Av. Iriarte 1673", phone: null },
      ]
      localStorage.setItem("elvisBarber_salons", JSON.stringify(loadedSalons))
    }

    setTimeout(() => {
      setServices(loadedServices)
      setSalons(loadedSalons)
      setIsHydrated(true)
    }, 0)
  }, [])

  const updateServices = (newServices: Service[]) => {
    setServices(newServices)
    localStorage.setItem("elvisBarber_services", JSON.stringify(newServices))
  }

  const updateSalons = (newSalons: Salon[]) => {
    setSalons(newSalons)
    localStorage.setItem("elvisBarber_salons", JSON.stringify(newSalons))
  }

  if (!isHydrated) {
    return null
  }

  return (
    <DataContext.Provider value={{ services, salons, updateServices, updateSalons }}>
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
