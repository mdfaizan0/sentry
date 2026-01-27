import { listAllProjects } from "@/api/projects.api"
import { useAuth } from "@/contexts/auth/useAuth"
import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import ProjectList from "@/components/projects/ProjectList"

function Dashboard() {
    const [projects, setProjects] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const { user } = useAuth()

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setIsLoading(true)
                const data = await listAllProjects()
                // Sort by date descending
                const sorted = [...data].sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                )
                setProjects(sorted)
            } catch (error) {
                console.error("Failed to fetch projects:", error)
            } finally {
                setIsLoading(false)
            }
        }
        if (user) {
            fetchProjects()
        }
    }, [user])

    if (!user) {
        return <Navigate to="/login" />
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome back, <span className="text-foreground font-medium">{user.name}</span>.
                    Manage and track your projects here.
                </p>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Projects</h2>
                <ProjectList
                    projects={projects}
                    isLoading={isLoading}
                    userId={user._id || user.id}
                />
            </div>
        </div>
    )
}

export default Dashboard