import { useState, useEffect, useCallback, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getOneTicket, updateTicket, deleteTicket, assignTicket, changeAssignee } from "@/api/tickets.api"
import { getOneProject } from "@/api/projects.api"
import { useAuth } from "@/contexts/auth/useAuth"
import CommentThread from "@/components/projects/CommentThread"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import BackButton from "@/components/ui/back-button"
import EditTicketModal from "@/components/projects/EditTicketModal"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import {
    Loader2,
    Edit2,
    Trash2,
    Clock,
    User as UserIcon,
    AlertCircle,
    Circle,
    CheckCircle2,
    Calendar,
    ArrowLeft,
    MessageSquare,
    ExternalLink
} from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
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
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import getInitials from "@/lib/getInitials"
import Loading from "@/components/Loading"

const statusConfig = {
    "Open": { color: "text-sky-400 bg-sky-400/10 border-sky-400/20", icon: Circle },
    "In Progress": { color: "text-amber-400 bg-amber-400/10 border-amber-400/20", icon: Clock },
    "Closed": { color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", icon: CheckCircle2 }
}

const priorityConfig = {
    "Low": { text: "text-slate-400", bg: "bg-slate-400/10", border: "border-slate-400/20" },
    "Medium": { text: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" },
    "High": { text: "text-rose-400", bg: "bg-rose-400/10", border: "border-rose-400/20" }
}

const TicketDetail = () => {
    const { projectId, ticketId } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()

    const [ticket, setTicket] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
    const [members, setMembers] = useState([])
    const [owner, setOwner] = useState(null)
    const [isAssigning, setIsAssigning] = useState(false)

    const allAssignees = useMemo(() => {
        if (!members) return []
        const ownerObj = typeof owner === 'string' ? null : owner
        if (ownerObj && !members.some(m => m._id === ownerObj._id)) {
            return [ownerObj, ...members]
        }
        return members
    }, [members, owner])



    const fetchTicket = useCallback(async () => {
        try {
            setIsLoading(true)
            const data = await getOneTicket(projectId, ticketId)
            setTicket(data)
        } catch (error) {
            console.error("Failed to fetch ticket:", error)
            toast.error("Failed to load ticket details")
            navigate(`/project/${projectId}`)
        } finally {
            setIsLoading(false)
        }
    }, [projectId, ticketId, navigate])

    const fetchProjectMembers = useCallback(async () => {
        try {
            const data = await getOneProject(projectId)
            if (data) {
                setMembers(data.members || [])
                setOwner(data.owner)
            }
        } catch (error) {
            console.error("Failed to fetch project members:", error)
        }
    }, [projectId])

    useEffect(() => {
        fetchTicket()
        fetchProjectMembers()
    }, [fetchTicket, fetchProjectMembers])



    const handleDelete = async () => {
        try {
            setIsSubmitting(true)
            await deleteTicket(projectId, ticketId)
            toast.success("Ticket deleted successfully")
            navigate(`/project/${projectId}`)
        } catch (error) {
            console.error("Failed to delete ticket:", error)
            toast.error(error.response?.data?.message || "Failed to delete ticket")
        } finally {
            setIsSubmitting(false)
            setIsDeleteAlertOpen(false)
        }
    }

    const handleAssignmentChange = async (assigneeId) => {
        try {
            setIsAssigning(true)
            if (ticket.assignee) {
                await changeAssignee(projectId, ticketId, assigneeId)
            } else {
                await assignTicket(projectId, ticketId, assigneeId)
            }
            toast.success("Assignee updated successfully")
            fetchTicket()
        } catch (error) {
            console.error("Failed to update assignee:", error)
            toast.error(error.response?.data?.message || "Failed to update assignee")
        } finally {
            setIsAssigning(false)
        }
    }

    const handleUnassignAction = async () => {
        try {
            setIsAssigning(true)
            await unassignTicket(projectId, ticketId)
            toast.success("Ticket unassigned successfully")
            fetchTicket()
        } catch (error) {
            console.error("Failed to unassign ticket:", error)
            toast.error(error.response?.data?.message || "Failed to unassign")
        } finally {
            setIsAssigning(false)
        }
    }

    if (isLoading) {
        return <Loading />
    }

    if (!ticket) return null

    const isOwner = user?.id === (owner?._id || owner) || user?.id === (ticket.projectId?.owner?._id || ticket.projectId?.owner)
    const isAssignee = user?.id === (ticket.assignee?._id || ticket.assignee)
    const canManageTicket = isOwner || isAssignee

    const formatDate = (dateString) => {
        return new Intl.DateTimeFormat('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(dateString))
    }

    const StatusIcon = statusConfig[ticket.status]?.icon || Circle

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header / Navigation */}
            <header className="sticky top-0 z-30 w-full border-b border-white/5 bg-background/80 backdrop-blur-md">
                <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <BackButton to={`/project/${projectId}`} label="Back to Project" />
                        <Separator orientation="vertical" className="h-6 bg-white/10" />
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className={cn("text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border flex items-center gap-1.5", statusConfig[ticket.status]?.color)}>
                                <StatusIcon size={12} />
                                {ticket.status}
                            </Badge>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {canManageTicket && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsEditModalOpen(true)}
                                className="bg-white/5 border-white/10"
                            >
                                <Edit2 size={14} className="mr-2" />
                                Edit Ticket
                            </Button>
                        )}
                        {isOwner && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsDeleteAlertOpen(true)}
                                className="text-rose-400 hover:text-rose-300 hover:bg-rose-400/10"
                            >
                                <Trash2 size={14} className="mr-2" />
                                Delete
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            <main className="container max-w-7xl mx-auto px-4 pt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                                {ticket.title}
                            </h1>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60">Description</h3>
                            <div className="prose prose-invert max-w-none">
                                <p className="text-lg text-foreground/80 leading-relaxed whitespace-pre-wrap">
                                    {ticket.description}
                                </p>
                            </div>
                        </div>



                        <Separator className="bg-white/5" />

                        {/* Discussion Section */}
                        <div className="pt-4">
                            <CommentThread ticketId={ticketId} projectId={projectId} />
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <div className="space-y-6">
                        <Card className="p-6 bg-card border-white/5 space-y-6 sticky top-24">
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Details</h4>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                                            <AlertCircle size={14} /> Priority
                                        </span>
                                        <Badge variant="outline" className={cn("text-xs px-2 py-0 border", priorityConfig[ticket.priority]?.text, priorityConfig[ticket.priority]?.bg, priorityConfig[ticket.priority]?.border)}>
                                            {ticket.priority}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                                            <Circle size={14} /> Status
                                        </span>
                                        <Badge variant="secondary" className={cn("bg-white/5 border-white/10 text-xs px-2 py-0", statusConfig[ticket.status]?.color)}>
                                            {ticket.status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <Separator className="bg-white/5" />

                            <div className="space-y-4">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Assignee</h4>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10 border border-primary/20">
                                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                            {ticket.assignee ? (getInitials(ticket.assignee.name)) : "?"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold">{ticket.assignee?.name || "Unassigned"}</span>
                                        <span className="text-xs text-muted-foreground">{ticket.assignee?.email || "Assign a member to get started"}</span>
                                    </div>
                                </div>

                                {isOwner && (
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <Select
                                                disabled={isAssigning}
                                                value={ticket.assignee?._id || (typeof ticket.assignee === 'string' ? ticket.assignee : "")}
                                                onValueChange={handleAssignmentChange}
                                            >
                                                <SelectTrigger className="flex-1 bg-white/5 border-white/10 h-9 text-xs">
                                                    <SelectValue placeholder="Reassign ticket..." />
                                                </SelectTrigger>
                                                <SelectContent className="bg-card border-white/10">
                                                    {allAssignees?.map(member => (
                                                        <SelectItem key={member._id} value={member._id} className="text-xs">
                                                            {member.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            {ticket.assignee && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-9 px-2 text-[10px] uppercase font-bold text-muted-foreground hover:text-rose-400"
                                                    onClick={handleUnassignAction}
                                                    disabled={isAssigning}
                                                >
                                                    {isAssigning ? <Loader2 size={12} className="animate-spin" /> : "Unassign"}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Separator className="bg-white/5" />

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-muted-foreground">
                                    <Calendar size={14} className="opacity-40" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase font-bold tracking-widest opacity-50">Created</span>
                                        <span className="text-xs font-medium">{formatDate(ticket.createdAt)}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-muted-foreground">
                                    <Clock size={14} className="opacity-40" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase font-bold tracking-widest opacity-50">Last Update</span>
                                        <span className="text-xs font-medium">{formatDate(ticket.updatedAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>

            <EditTicketModal
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                projectId={projectId}
                ticket={ticket}
                onSuccess={fetchTicket}
            />

            <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                <AlertDialogContent className="bg-card border-white/10">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the ticket
                            and remove it from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white/5 border-white/10">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-rose-500 hover:bg-rose-600 focus:ring-rose-500"
                        >
                            Delete Ticket
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default TicketDetail
