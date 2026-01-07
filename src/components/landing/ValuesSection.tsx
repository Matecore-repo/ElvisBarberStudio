'use client';

import { motion } from "framer-motion";
import { ArrowRight, Award, Heart, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const ValuesSection = () => {
    const values = [
        {
            icon: Award,
            title: "Profesionalismo",
            description: "Servicio de calidad excepcional en cada visita",
        },
        {
            icon: Sparkles,
            title: "Creatividad",
            description: "Estilos únicos adaptados a tu personalidad",
        },
        {
            icon: Heart,
            title: "Atención al Detalle",
            description: "Perfección en cada corte y acabado",
        },
    ];

    return (
        <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-black">
            {/* Subtle background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-900/5 to-transparent pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto w-full px-6 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left Side - Striped Background Pattern */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative h-full min-h-[400px] lg:min-h-[600px] rounded-2xl overflow-hidden bg-gradient-to-br from-neutral-900/50 to-neutral-950/50 border border-neutral-800"
                    >
                        {/* Animated Diagonal Stripes - Barber pole style */}
                        <div
                            className="absolute inset-0 animate-[stripes_12s_linear_infinite]"
                            style={{
                                backgroundImage: `repeating-linear-gradient(
                  45deg,
                  rgba(212, 175, 55, 0.08) 0px,
                  rgba(212, 175, 55, 0.08) 40px,
                  rgba(249, 212, 35, 0.06) 40px,
                  rgba(249, 212, 35, 0.06) 80px,
                  rgba(201, 164, 76, 0.08) 80px,
                  rgba(201, 164, 76, 0.08) 120px,
                  rgba(255, 255, 255, 0.02) 120px,
                  rgba(255, 255, 255, 0.02) 160px
                )`,
                            }}
                        />

                        {/* Fade overlay for edges */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />

                        {/* Subtle ambient glow */}
                        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl" />
                    </motion.div>

                    {/* Right Side - Content */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="space-y-4"
                        >
                            <div className="inline-block px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full">
                                <span className="text-sm font-semibold gold-metallic-text">
                                    Nuestros Valores
                                </span>
                            </div>

                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                                Excelencia en cada corte,{" "}
                                <span className="gold-gradient-text">pasión</span> en cada estilo
                            </h2>

                            <p className="text-lg text-gray-400 max-w-xl">
                                Más que una barbería, somos artistas dedicados a realzar tu estilo único.
                                Con años de experiencia y pasión por nuestro oficio.
                            </p>
                        </motion.div>

                        {/* Values Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4"
                        >
                            {values.map((value, index) => (
                                <motion.div
                                    key={value.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                                    className="space-y-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                                            <value.icon className="w-5 h-5 text-amber-400" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white mb-1">
                                            {value.title}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {value.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* CTA Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                            className="pt-4"
                        >
                            <Link href="#barberos">
                                <Button
                                    size="lg"
                                    className="gold-metallic-button group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-gold"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        Conoce Nuestro Equipo
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </span>
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};
