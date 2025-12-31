import { prisma } from "../src/lib/prisma"
import bcrypt from "bcryptjs"

async function verifyLogin() {
    const email = "iangel.oned@gmail.com"
    const password = "Admin123!@#"

    console.log("Testing login for:", email)

    const user = await prisma.user.findUnique({
        where: { email }
    })

    if (!user) {
        console.log("❌ User not found!")
        return
    }

    console.log("✓ User found:", user.email)
    console.log("  - Role:", user.role)
    console.log("  - Has passwordHash:", !!user.passwordHash)
    console.log("  - passwordHash length:", user.passwordHash?.length || 0)

    if (user.passwordHash) {
        const isValid = await bcrypt.compare(password, user.passwordHash)
        console.log("  - Password valid:", isValid)

        if (!isValid) {
            console.log("\n⚠️ Password doesn't match. Updating...")
            const newHash = await bcrypt.hash(password, 12)
            await prisma.user.update({
                where: { id: user.id },
                data: { passwordHash: newHash }
            })
            console.log("✓ Password updated!")
        }
    } else {
        console.log("\n⚠️ No password hash. Setting...")
        const newHash = await bcrypt.hash(password, 12)
        await prisma.user.update({
            where: { id: user.id },
            data: { passwordHash: newHash }
        })
        console.log("✓ Password hash set!")
    }

    console.log("\n✅ Try login now!")
}

verifyLogin()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
