import { Outlet } from "react-router-dom"
import Navbar from "@/components/Navbar"

const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />
            <div className="flex-1 flex pt-16">
                <main className="flex-1">
                    <div className="container mx-auto p-6 md:p-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}

export default DashboardLayout
