import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('Iniciando seed...')

    // Hashear contraseñas
    const adminPassword = await bcrypt.hash('admin123', 10)
    const elvisPassword = await bcrypt.hash('elvis123', 10)

    // Crear o actualizar Admin
    const admin = await prisma.user.upsert({
        where: { email: 'admin@barber.com' },
        update: {
            passwordHash: adminPassword,
            role: 'admin',
            name: 'Admin User'
        },
        create: {
            email: 'admin@barber.com',
            name: 'Admin User',
            passwordHash: adminPassword,
            role: 'admin',
        },
    })
    console.log({ admin })

    // Crear o actualizar Elvis
    const elvis = await prisma.user.upsert({
        where: { email: 'elvis@barber.com' },
        update: {
            passwordHash: elvisPassword,
            role: 'owner',
            name: 'Elvis Barber'
        },
        create: {
            email: 'elvis@barber.com',
            name: 'Elvis Barber',
            passwordHash: elvisPassword,
            role: 'owner',
        },
    })
    console.log({ elvis })

    console.log('Seed completado.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
