import { useEffect, useState, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getOneProject } from "@/api/projects.api"
import { listAllTickets } from "@/api/tickets.api"
import { useAuth } from "@/contexts/auth/useAuth"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Users, Ticket, Activity as ActivityIcon, Plus } from "lucide-react"
import TicketList from "@/components/projects/TicketList"
import CreateTicketModal from "@/components/projects/CreateTicketModal"

function ProjectDetail() {
    const { projectId } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const [project, setProject] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [tickets, setTickets] = useState([])
    const [isTicketsLoading, setIsTicketsLoading] = useState(true)
    const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false)

    const fetchProject = useCallback(async () => {
        try {
            setIsLoading(true)
            const data = await getOneProject(projectId)
            if (data) {
                setProject(data)
            } else {
                // Not found or error handled by client interceptor
                navigate("/dashboard")
            }
        } catch (error) {
            console.error("Failed to fetch project:", error)
        } finally {
            setIsLoading(false)
        }
    }, [projectId, navigate])

    const fetchTickets = useCallback(async () => {
        try {
            setIsTicketsLoading(true)
            const data = await listAllTickets(projectId)
            setTickets(data)
        } catch (error) {
            console.error("Failed to fetch tickets:", error)
        } finally {
            setIsTicketsLoading(false)
        }
    }, [projectId])

    useEffect(() => {
        fetchProject()
        fetchTickets()
    }, [fetchProject, fetchTickets])

    if (isLoading) {
        return (
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="space-y-4">
                    <Skeleton className="h-10 w-1/3" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-10 w-full max-w-md" />
                    <Skeleton className="h-40 w-full shadow-none border-white/5 bg-card/50" />
                </div>
            </div>
        )
    }

    if (!project) return null

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Project Header */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1.5 px-3 py-1">
                        <ShieldCheck size={14} />
                        Active Project
                    </Badge>
                </div>
                <p className="text-muted-foreground max-w-2xl leading-relaxed">
                    {project.description || "No description provided for this project."}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-white/5 w-fit px-3 py-1.5 rounded-lg border border-white/5">
                        <span className="font-semibold text-foreground/70">Created By:</span>
                        <span className="text-foreground font-medium">{project.owner?.name}</span>
                        <span className="text-[10px] opacity-70">({project.owner?.email})</span>
                    </div>
                </div>
            </div>

            {/* Feature Tabs */}
            <Tabs defaultValue="tickets" className="w-full">
                <TabsList className="bg-white/5 border border-white/10 p-1 mb-6">
                    <TabsTrigger value="tickets" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Ticket size={16} className="mr-2" />
                        Tickets
                    </TabsTrigger>
                    <TabsTrigger value="members">
                        <Users size={16} className="mr-2" />
                        Members
                    </TabsTrigger>
                    <TabsTrigger value="activity">
                        <ActivityIcon size={16} className="mr-2" />
                        Activity
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="tickets" className="outline-none focus:ring-0">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Project Tickets</h2>
                            <Button
                                onClick={() => setIsCreateTicketOpen(true)}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                            >
                                <Plus size={16} className="mr-2" />
                                Create Ticket
                            </Button>
                        </div>
                        <TicketList
                            tickets={tickets}
                            isLoading={isTicketsLoading}
                            projectId={projectId}
                            isOwner={project.owner?._id === user?.id}
                            onRefresh={fetchTickets}
                        />
                    </div>
                </TabsContent>

                <TabsContent value="members" className="outline-none focus:ring-0">
                    <PlaceholderSection
                        title="Team Members"
                        description="Manage project access, invite collaborators, and assign roles. This feature will be implemented in the next phase."
                    />
                </TabsContent>

                <TabsContent value="activity" className="outline-none focus:ring-0">
                    <PlaceholderSection
                        title="Project Activity"
                        description="Track changes, comments, and updates made to the project and its tickets. This feature is coming soon."
                    />
                </TabsContent>
            </Tabs>

            <CreateTicketModal
                open={isCreateTicketOpen}
                onOpenChange={setIsCreateTicketOpen}
                projectId={projectId}
                onSuccess={fetchTickets}
            />
        </div>
    )
}

const PlaceholderSection = ({ title, description }) => (
    <Card className="bg-card/50 border-white/5 border-dashed border-2 py-12 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4 text-muted-foreground">
            <ActivityIcon size={24} />
        </div>
        <CardTitle className="text-xl mb-2">{title}</CardTitle>
        <CardDescription className="max-w-md mx-auto">
            {description}
        </CardDescription>
    </Card>
)

export default ProjectDetail