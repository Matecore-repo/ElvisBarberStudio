import { prisma } from "../src/lib/prisma"
import bcrypt from "bcryptjs"

async function main() {
    // Create default salon
    const salon = await prisma.salon.create({
        data: {
            name: "Elvis Barber Studio",
            address: "Av. Principal 1234",
            phone: "+54 11 1234-5678",
        },
    })

    console.log("✓ Salon created:", salon.name)

    // Create admin user
    const passwordHash = await bcrypt.hash("Admin123!@#", 12)

    const user = await prisma.user.create({
        data: {
            email: "iangel.oned@gmail.com",
            name: "Admin",
            passwordHash,
            role: "OWNER",
            salonId: salon.id,
        },
    })

    console.log("✓ User created:", user.email)

    // Create sample barbers
    const barber1 = await prisma.barber.create({
        data: {
            salonId: salon.id,
            name: "Carlos López",
            commissionType: "PERCENT",
            commissionValue: 30,
        },
    })

    const barber2 = await prisma.barber.create({
        data: {
            salonId: salon.id,
            name: "Miguel Rodríguez",
            commissionType: "PERCENT",
            commissionValue: 25,
        },
    })

    console.log("✓ Barbers created:", barber1.name, barber2.name)

    // Create sample services
    const service1 = await prisma.service.create({
        data: {
            salonId: salon.id,
            name: "Corte Clásico",
            durationMinutes: 30,
            price: 2500,
        },
    })

    const service2 = await prisma.service.create({
        data: {
            salonId: salon.id,
            name: "Barba Completa",
            durationMinutes: 20,
            price: 1800,
        },
    })

    console.log("✓ Services created:", service1.name, service2.name)

    console.log("\n✅ Seed completed!")
    console.log("Login with: iangel.oned@gmail.com / Admin123!@#")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
