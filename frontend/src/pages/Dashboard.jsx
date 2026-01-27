import { listAllProjects } from "@/api/projects.api"
import { useAuth } from "@/contexts/auth/useAuth"
import { useEffect, useState, useCallback } from "react"
import { Navigate } from "react-router-dom"
import ProjectList from "@/components/projects/ProjectList"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import CreateProjectModal from "@/components/projects/CreateProjectModal"

function Dashboard() {
    const [projects, setProjects] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const { user } = useAuth()

    const fetchProjects = useCallback(async () => {
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
    }, [])

    useEffect(() => {
        if (user) {
            fetchProjects()
        }
    }, [user, fetchProjects])

    if (!user) {
        return <Navigate to="/login" />
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome back, <span className="text-foreground font-medium">{user.name}</span>.
                        Manage and track your projects here.
                    </p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)} className="w-full md:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Project
                </Button>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Projects</h2>
                <ProjectList
                    projects={projects}
                    isLoading={isLoading}
                    userId={user._id || user.id}
                />
            </div>

            <CreateProjectModal
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
                onSuccess={fetchProjects}
            />
        </div>
    )
}

export default Dashboard