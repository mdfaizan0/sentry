import { useState, useEffect, useCallback } from "react"
import { getOneTicket, updateTicket, deleteTicket } from "@/api/tickets.api"
import { useAuth } from "@/contexts/auth/useAuth"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
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
    ArrowLeft
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const statusConfig = {
    "Open": { color: "text-sky-400 bg-sky-400/10 border-sky-400/20", icon: Circle },
    "In Progress": { color: "text-amber-400 bg-amber-400/10 border-amber-400/20", icon: Clock },
    "Closed": { color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", icon: CheckCircle2 }
}

const priorityConfig = {
    "Low": { text: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/20" },
    "Medium": { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    "High": { text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" }
}

const TicketDetailModal = ({ open, onOpenChange, ticketId, projectId, isOwner, onSuccess }) => {
    const { user } = useAuth()
    const [ticket, setTicket] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "",
        priority: ""
    })

    const isAssignee = ticket?.assignee?._id === user?.id || ticket?.assignee === user?.id
    const canManageTicket = isOwner || isAssignee

    const fetchTicket = useCallback(async () => {
        try {
            setIsLoading(true)
            const data = await getOneTicket(projectId, ticketId)
            setTicket(data)
            if (data) {
                setFormData({
                    title: data.title,
                    description: data.description,
                    status: data.status,
                    priority: data.priority
                })
            }
        } catch (error) {
            console.error("Failed to fetch ticket:", error)
            toast.error("Failed to load ticket details")
            onOpenChange(false)
        } finally {
            setIsLoading(false)
        }
    }, [projectId, ticketId, onOpenChange])

    useEffect(() => {
        if (open && ticketId) {
            fetchTicket()
            setIsEditing(false)
        }
    }, [open, ticketId, fetchTicket])

    const handleUpdate = async (e) => {
        e.preventDefault()
        if (!formData.title.trim() || !formData.description.trim()) return

        try {
            setIsSubmitting(true)
            await updateTicket(projectId, ticketId, formData)
            toast.success("Ticket updated successfully")
            setIsEditing(false)
            fetchTicket()
            onSuccess?.()
        } catch (error) {
            console.error("Failed to update ticket:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        try {
            setIsDeleting(true)
            await deleteTicket(projectId, ticketId)
            toast.success("Ticket deleted successfully")
            setIsDeleteAlertOpen(false)
            onOpenChange(false)
            onSuccess?.()
        } catch (error) {
            console.error("Failed to delete ticket:", error)
        } finally {
            setIsDeleting(false)
        }
    }

    const formatDate = (dateString) => {
        return new Intl.DateTimeFormat('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(dateString))
    }

    const StatusIcon = ticket ? (statusConfig[ticket.status]?.icon || Circle) : Circle

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[600px] bg-card border-white/10 overflow-hidden p-0">
                    {isLoading ? (
                        <div className="p-12 flex flex-col items-center justify-center space-y-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">Fetching ticket details...</p>
                        </div>
                    ) : ticket && (
                        <>
                            <DialogHeader className="p-6 pb-0">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className={cn("text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border flex items-center gap-1.5", statusConfig[ticket.status]?.color)}>
                                            <StatusIcon size={12} />
                                            {ticket.status}
                                        </Badge>
                                        <Badge variant="outline" className={cn("text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border flex items-center gap-1.5", priorityConfig[ticket.priority]?.text, priorityConfig[ticket.priority]?.bg, priorityConfig[ticket.priority]?.border)}>
                                            <AlertCircle size={12} />
                                            {ticket.priority}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {!isEditing && (
                                            <>
                                                {canManageTicket && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 px-2 text-muted-foreground hover:text-foreground"
                                                        onClick={() => setIsEditing(true)}
                                                    >
                                                        <Edit2 size={14} className="mr-1.5" />
                                                        Edit
                                                    </Button>
                                                )}
                                                {isOwner && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 px-2 text-rose-400 hover:text-rose-300 hover:bg-rose-400/10"
                                                        onClick={() => setIsDeleteAlertOpen(true)}
                                                    >
                                                        <Trash2 size={14} className="mr-1.5" />
                                                        Delete
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                                <DialogTitle className="text-2xl font-bold leading-tight">
                                    {isEditing ? "Edit Ticket" : ticket.title}
                                </DialogTitle>
                            </DialogHeader>

                            <div className="p-6 space-y-6">
                                {isEditing ? (
                                    <form onSubmit={handleUpdate} className="space-y-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="title">Title</Label>
                                            <Input
                                                id="title"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                className="bg-white/5 border-white/10"
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="description">Description</Label>
                                            <Textarea
                                                id="description"
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                className="bg-white/5 border-white/10 min-h-[120px]"
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label>Status</Label>
                                                <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                                                    <SelectTrigger className="bg-white/5 border-white/10">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-card border-white/10">
                                                        <SelectItem value="Open">Open</SelectItem>
                                                        <SelectItem value="In Progress">In Progress</SelectItem>
                                                        <SelectItem value="Closed">Closed</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Priority</Label>
                                                <Select value={formData.priority} onValueChange={(val) => setFormData({ ...formData, priority: val })}>
                                                    <SelectTrigger className="bg-white/5 border-white/10">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-card border-white/10">
                                                        <SelectItem value="Low">Low</SelectItem>
                                                        <SelectItem value="Medium">Medium</SelectItem>
                                                        <SelectItem value="High">High</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-3 pt-4">
                                            <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>
                                                Cancel
                                            </Button>
                                            <Button type="submit" disabled={isSubmitting}>
                                                {isSubmitting ? <Loader2 className="animate-spin" /> : "Save Changes"}
                                            </Button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <div className="space-y-2">
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Description</h4>
                                            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                                                {ticket.description}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5">
                                            <div className="space-y-2">
                                                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Assignee</h4>
                                                <div className="flex items-center gap-2.5">
                                                    <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                                                        {ticket.assignee ? ticket.assignee.name.split(" ").map(n => n[0]).join("").toUpperCase() : <UserIcon size={14} />}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">{ticket.assignee?.name || "Unassigned"}</p>
                                                        {ticket.assignee && <p className="text-[10px] text-muted-foreground">{ticket.assignee.email}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Calendar size={14} className="opacity-50" />
                                                    <span className="text-[11px]">Created: {formatDate(ticket.createdAt)}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Clock size={14} className="opacity-50" />
                                                    <span className="text-[11px]">Updated: {formatDate(ticket.updatedAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

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
                        <AlertDialogCancel className="bg-transparent border-white/10">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault()
                                handleDelete()
                            }}
                            className="bg-rose-500 hover:bg-rose-600 text-white"
                            disabled={isDeleting}
                        >
                            {isDeleting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : "Delete Ticket"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default TicketDetailModal
