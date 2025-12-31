import { prisma } from "../src/lib/prisma"
import bcrypt from "bcryptjs"

async function checkAndFixUser() {
    console.log("Checking users in database...")

    const users = await prisma.user.findMany()
    console.log("Users found:", users.length)

    if (users.length === 0) {
        console.log("No users found! Creating admin user...")

        // Get or create salon
        let salon = await prisma.salon.findFirst()
        if (!salon) {
            salon = await prisma.salon.create({
                data: {
                    name: "Elvis Barber Studio",
                    address: "Av. Principal 1234",
                    phone: "+54 11 1234-5678",
                },
            })
            console.log("✓ Salon created:", salon.name)
        }

        // Create admin user with proper password hash
        const passwordHash = await bcrypt.hash("Admin123!@#", 12)
        console.log("Generated hash:", passwordHash)

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
    } else {
        console.log("Existing users:")
        for (const user of users) {
            console.log(`- ${user.email} (${user.role}) - Has password hash: ${!!user.passwordHash}`)

            // If no password hash, update it
            if (!user.passwordHash) {
                const passwordHash = await bcrypt.hash("Admin123!@#", 12)
                await prisma.user.update({
                    where: { id: user.id },
                    data: { passwordHash }
                })
                console.log(`  ✓ Updated password for ${user.email}`)
            }
        }
    }

    console.log("\n✅ Done! Try login with: iangel.oned@gmail.com / Admin123!@#")
}

checkAndFixUser()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
