import { useEffect, useState, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getOneProject, deleteProject } from "@/api/projects.api"
import { listAllTickets } from "@/api/tickets.api"
import { useAuth } from "@/contexts/auth/useAuth"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ShieldCheck, Users, Ticket, Activity as ActivityIcon, Plus, MoreVertical, Edit, Trash2, Calendar, Loader2, LayoutList, LayoutGrid } from "lucide-react"
import { toast } from "sonner"

import TicketList from "@/components/projects/TicketList"
import CreateTicketModal from "@/components/projects/CreateTicketModal"
import MemberManagement from "@/components/projects/MemberManagement"
import EditProjectModal from "@/components/projects/EditProjectModal"
import BackButton from "@/components/ui/back-button"
import { cn } from "@/lib/utils"
import TicketKanbanBoard from "@/components/projects/kanban/TicketKanbanBoard"
import TicketDetailModal from "@/components/projects/TicketDetailModal"

function ProjectDetail() {
    const { projectId } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const [project, setProject] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [tickets, setTickets] = useState([])
    const [isTicketsLoading, setIsTicketsLoading] = useState(true)
    const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false)

    // Project CRUD State
    const [isEditProjectOpen, setIsEditProjectOpen] = useState(false)
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
    const [isDeletingProject, setIsDeletingProject] = useState(false)
    const [viewMode, setViewMode] = useState("list")
    const [selectedTicket, setSelectedTicket] = useState(null)
    const [isDetailOpen, setIsDetailOpen] = useState(false)

    const fetchProject = useCallback(async () => {
        try {
            setIsLoading(true)
            const data = await getOneProject(projectId)
            if (data) {
                setProject(data)
            } else {
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

    const handleDeleteProject = async () => {
        try {
            setIsDeletingProject(true)
            await deleteProject(projectId)
            toast.success("Project deleted successfully")
            navigate("/dashboard")
        } catch (error) {
            console.error("Failed to delete project:", error)
            toast.error("Failed to delete project")
            setIsDeletingProject(false)
        }
    }

    const handleTicketClick = (ticket) => {
        setSelectedTicket(ticket)
        setIsDetailOpen(true)
    }

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

    const isOwner = project.owner?._id === user?.id

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-screen pb-20">
            {/* Top Navigation */}
            <div className="flex items-center justify-between">
                <BackButton to="/dashboard" label="Back to Dashboard" />
            </div>

            {/* Project Header */}
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between border-b border-white/5 pb-8">
                <div className="space-y-4 max-w-3xl">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-bold tracking-tight text-foreground">{project.title}</h1>
                            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 flex items-center gap-1.5 px-2.5 py-0.5 mt-1">
                                <ShieldCheck size={12} />
                                Active
                            </Badge>
                        </div>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {project.description || "No description provided for this project."}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pt-2">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm shadow-primary/10">
                                <span className="font-bold text-xs">{project.owner?.name?.charAt(0).toUpperCase()}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">Created By</span>
                                <span className="font-medium text-foreground">{project.owner?.name}</span>
                            </div>
                        </div>

                        <div className="w-px h-8 bg-white/10 hidden sm:block" />

                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-muted-foreground">
                                <Calendar size={14} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">Created</span>
                                <span className="font-medium text-foreground">{new Date(project.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => setIsCreateTicketOpen(true)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                    >
                        <Plus size={16} className="mr-2" />
                        New Ticket
                    </Button>

                    {isOwner && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon" className="bg-transparent border-white/10 hover:bg-white/5 text-muted-foreground hover:text-foreground">
                                    <MoreVertical size={18} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-card border-white/10">
                                <DropdownMenuItem onClick={() => setIsEditProjectOpen(true)} className="gap-2 cursor-pointer">
                                    <Edit size={14} />
                                    Edit Project
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-white/5" />
                                <DropdownMenuItem
                                    onClick={() => setIsDeleteAlertOpen(true)}
                                    className="gap-2 text-rose-500 hover:text-rose-400 focus:text-rose-400 focus:bg-rose-500/10 cursor-pointer"
                                >
                                    <Trash2 size={14} />
                                    Delete Project
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>

            {/* Feature Tabs */}
            <Tabs defaultValue="tickets" className="w-full space-y-8">
                <TabsList className="bg-transparent border-b border-white/5 w-full justify-start h-auto p-0 rounded-none space-x-8">
                    <TabsTrigger
                        value="tickets"
                        className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 pb-4 pt-2 font-medium text-muted-foreground data-[state=active]:text-foreground rounded-none shadow-none transition-all hover:text-foreground/80"
                    >
                        <div className="flex items-center gap-2">
                            <Ticket size={16} />
                            Tickets
                        </div>
                    </TabsTrigger>
                    <TabsTrigger
                        value="members"
                        className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 pb-4 pt-2 font-medium text-muted-foreground data-[state=active]:text-foreground rounded-none shadow-none transition-all hover:text-foreground/80"
                    >
                        <div className="flex items-center gap-2">
                            <Users size={16} />
                            Members
                        </div>
                    </TabsTrigger>
                    <TabsTrigger
                        value="activity"
                        className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 pb-4 pt-2 font-medium text-muted-foreground data-[state=active]:text-foreground rounded-none shadow-none transition-all hover:text-foreground/80"
                    >
                        <div className="flex items-center gap-2">
                            <ActivityIcon size={16} />
                            Activity
                        </div>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="tickets" className="outline-none focus:ring-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <h2 className="text-xl font-semibold">Project Tickets</h2>
                                <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/10">
                                    <button
                                        onClick={() => setViewMode("list")}
                                        className={cn("p-1.5 rounded-md transition-all", viewMode === "list" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-white/5")}
                                    >
                                        <LayoutList size={16} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode("board")}
                                        className={cn("p-1.5 rounded-md transition-all", viewMode === "board" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-white/5")}
                                    >
                                        <LayoutGrid size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {viewMode === "list" ? (
                            <TicketList
                                tickets={tickets}
                                isLoading={isTicketsLoading}
                                projectId={projectId}
                                isOwner={isOwner}
                                owner={project.owner}
                                members={project.members}
                                onRefresh={fetchTickets}
                                onTicketClick={handleTicketClick}
                            />
                        ) : (
                            <TicketKanbanBoard
                                tickets={tickets}
                                projectId={projectId}
                                isOwner={isOwner}
                                currentUserId={user?.id}
                                onTicketUpdate={fetchTickets}
                                onTicketClick={handleTicketClick}
                            />
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="members" className="outline-none focus:ring-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <MemberManagement
                        projectId={projectId}
                        members={project.members}
                        ownerId={project.owner?._id}
                        isOwner={isOwner}
                        onRefresh={fetchProject}
                    />
                </TabsContent>

                <TabsContent value="activity" className="outline-none focus:ring-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
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

            <EditProjectModal
                open={isEditProjectOpen}
                onOpenChange={setIsEditProjectOpen}
                project={project}
                onSuccess={fetchProject}
            />

            {selectedTicket && (
                <TicketDetailModal
                    open={isDetailOpen}
                    onOpenChange={setIsDetailOpen}
                    ticketId={selectedTicket._id}
                    projectId={projectId}
                    isOwner={isOwner}
                    owner={project.owner}
                    members={project.members}
                    onSuccess={fetchTickets}
                />
            )}

            <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                <AlertDialogContent className="bg-card border-white/10">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Project?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete "{project.title}" and all its tickets. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border-white/10">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault()
                                handleDeleteProject()
                            }}
                            className="bg-rose-500 hover:bg-rose-600 text-white"
                            disabled={isDeletingProject}
                        >
                            {isDeletingProject ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : "Delete Project"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

const PlaceholderSection = ({ title, description }) => (
    <Card className="bg-card/50 border-white/5 border-dashed border-2 py-12 flex flex-col items-center justify-center text-center shadow-none">
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