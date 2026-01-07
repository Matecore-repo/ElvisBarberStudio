'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin } from "lucide-react";

interface Location {
    id: number;
    name: string;
    location: string;
    image: string;
}

const locations: Location[] = [
    {
        id: 1,
        name: "Elvis Barber Studio - Centro",
        location: "Av. Principal 123, Centro",
        image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&h=600&fit=crop",
    },
    {
        id: 2,
        name: "Elvis Barber Studio - Norte",
        location: "Blvd. Norte 456, Zona Norte",
        image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&h=600&fit=crop",
    },
    {
        id: 3,
        name: "Elvis Barber Studio - Sur",
        location: "Calle Sur 789, Zona Sur",
        image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&h=600&fit=crop",
    },
    {
        id: 4,
        name: "Elvis Barber Studio - Plaza",
        location: "Centro Comercial Plaza, Local 15",
        image: "https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?w=800&h=600&fit=crop",
    },
    {
        id: 5,
        name: "Elvis Barber Studio - Downtown",
        location: "Av. Downtown 321, Centro",
        image: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&h=600&fit=crop",
    },
    {
        id: 6,
        name: "Elvis Barber Studio - Premium",
        location: "Torre Premium, Piso 2",
        image: "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=800&h=600&fit=crop",
    },
];

interface LocationCardProps {
    location: Location;
    index: number;
    hoveredIndex: number | null;
    setHoveredIndex: (index: number | null) => void;
}

function LocationCard({ location, index, hoveredIndex, setHoveredIndex }: LocationCardProps) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
            className="relative group overflow-hidden rounded-2xl h-80 cursor-pointer transition-all duration-300 ease-out hover:scale-[1.02]"
            style={{
                boxShadow: hoveredIndex === index
                    ? "0 0 30px rgba(212, 175, 55, 0.4)"
                    : "0 10px 30px rgba(0, 0, 0, 0.5)",
            }}
        >
            {/* Hover background glow */}
            <AnimatePresence>
                {hoveredIndex === index && (
                    <motion.div
                        className="absolute inset-0 bg-amber-500/20 z-[1]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { duration: 0.3 } }}
                        exit={{ opacity: 0, transition: { duration: 0.3 } }}
                    />
                )}
            </AnimatePresence>

            {/* Image with zoom hover */}
            <div className="absolute inset-0 z-0">
                <img
                    src={location.image}
                    alt={`${location.name} - Barbería profesional`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            {/* Overlay gradient for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-[2]" />

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-end p-6">
                <motion.h3
                    className="text-xl font-bold text-white mb-2 tracking-tight"
                    initial={{ y: 10, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                >
                    {location.name}
                </motion.h3>
                <motion.div
                    className="flex items-center gap-2 text-sm text-gray-400"
                    initial={{ y: 10, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                >
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <p>{location.location}</p>
                </motion.div>
            </div>

            {/* Golden border hover effect */}
            <div
                className="absolute inset-0 border-2 rounded-2xl transition-all duration-300 pointer-events-none z-[3]"
                style={{
                    borderColor: hoveredIndex === index ? "#D4AF37" : "transparent",
                }}
            />

            {/* Subtle noise texture overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-30 mix-blend-overlay z-[2]" />
        </motion.article>
    );
}

export const LocationsSection = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <section id="ubicaciones" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black via-neutral-950 to-black">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <motion.div
                    className="mb-12 text-center"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        Nuestras <span className="gold-gradient-text">Ubicaciones</span>
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Encuentra tu sucursal más cercana
                    </p>
                </motion.div>

                {/* Grid of Location Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {locations.map((location, idx) => (
                        <LocationCard
                            key={location.id}
                            location={location}
                            index={idx}
                            hoveredIndex={hoveredIndex}
                            setHoveredIndex={setHoveredIndex}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
