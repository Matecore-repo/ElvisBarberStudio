import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/DashboardShell"
import { DataProvider } from "@/contexts/DataContext"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session) {
        redirect("/login")
    }

    return (
        <DataProvider>
            <DashboardShell user={session.user}>{children}</DashboardShell>
        </DataProvider>
    )
}
