import { listAllProjects } from "@/api/projects.api"
import { getDashboardData } from "@/api/dashboard.api"
import { useAuth } from "@/contexts/auth/useAuth"
import { useEffect, useState, useCallback } from "react"
import { Navigate, Link } from "react-router-dom"
import ProjectList from "@/components/projects/ProjectList"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Layout, CheckCircle2, AlertTriangle, Clock } from "lucide-react"
import CreateProjectModal from "@/components/projects/CreateProjectModal"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

function Dashboard() {
    const [projects, setProjects] = useState([])
    const [dashboardStats, setDashboardStats] = useState(null)
    const [activeWork, setActiveWork] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const { user } = useAuth()

    const fetchDashData = useCallback(async () => {
        try {
            setIsLoading(true)
            const [projectsData, dashData] = await Promise.all([
                listAllProjects(),
                getDashboardData()
            ])

            setProjects([...projectsData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
            setDashboardStats(dashData.stats)
            setActiveWork(dashData.activeWork || [])
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        if (user) {
            fetchDashData()
        }
    }, [user, fetchDashData])

    if (!user) {
        return <Navigate to="/login" />
    }

    return (
        <div className="space-y-10 max-w-7xl mx-auto pb-12">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Welcome back, <span className="text-foreground font-semibold">{user.name}</span>. Here's what's happening.
                    </p>
                </div>
                <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    size="lg"
                    className="w-full md:w-auto shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95"
                >
                    <Plus className="mr-2 h-5 w-5" />
                    New Project
                </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-card/40 border-white/5 overflow-hidden relative group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Layout size={16} /> Total Projects
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{isLoading ? "..." : dashboardStats?.totalProjects || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Active workspaces</p>
                    </CardContent>
                </Card>

                <Card className="bg-card/40 border-white/5 overflow-hidden relative group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-sky-500" />
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <CheckCircle2 size={16} /> Active Tasks
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-sky-400">{isLoading ? "..." : dashboardStats?.activeTicketsCount || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Assigned to you</p>
                    </CardContent>
                </Card>

                <Card className="bg-card/40 border-white/5 overflow-hidden relative group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <AlertTriangle size={16} /> High Priority
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-rose-400">{isLoading ? "..." : dashboardStats?.highPriorityCount || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Requiring attention</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Content: Project List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold tracking-tight">Your Projects</h2>
                    </div>
                    <ProjectList
                        projects={projects}
                        isLoading={isLoading}
                        userId={user._id || user.id}
                    />
                </div>

                {/* Sidebar Content: My Active Work */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                        <Clock className="text-primary" size={20} /> My Active Work
                    </h2>
                    <div className="space-y-3">
                        {isLoading ? (
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="h-24 bg-card/20 border border-white/5 rounded-xl animate-pulse" />
                            ))
                        ) : activeWork.length > 0 ? (
                            activeWork.map((ticket) => (
                                <Link
                                    key={ticket._id}
                                    to={`/project/${ticket.projectId._id}/ticket/${ticket._id}`}
                                    className="block group"
                                >
                                    <div className="p-4 rounded-xl bg-card/30 border border-white/5 hover:border-primary/30 hover:bg-white/5 transition-all group-active:scale-[0.98]">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <Badge variant="outline" className={cn(
                                                "text-[10px] px-1.5 py-0 h-4 border-none",
                                                ticket.priority === "High" ? "bg-rose-500/10 text-rose-400" :
                                                    ticket.priority === "Medium" ? "bg-blue-500/10 text-blue-400" :
                                                        "bg-slate-500/10 text-slate-400"
                                            )}>
                                                {ticket.priority}
                                            </Badge>
                                            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                                                {ticket.projectId.title}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-1">
                                            {ticket.title}
                                        </h3>
                                        <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                                            Last update {new Date(ticket.updatedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="p-8 text-center border border-dashed border-white/10 rounded-xl bg-white/5">
                                <p className="text-sm text-muted-foreground">No active tasks assigned.</p>
                                <p className="text-[11px] text-muted-foreground/60 mt-1">Relax or pick up a new ticket!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <CreateProjectModal
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
                onSuccess={fetchDashData}
            />
        </div>
    )
}

export default Dashboard
