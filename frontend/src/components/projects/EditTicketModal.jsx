import { useState, useEffect } from "react"
import { updateTicket } from "@/api/tickets.api"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

const EditTicketModal = ({ open, onOpenChange, projectId, ticket, onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "",
        priority: ""
    })

    useEffect(() => {
        if (ticket) {
            setFormData({
                title: ticket.title || "",
                description: ticket.description || "",
                status: ticket.status || "Open",
                priority: ticket.priority || "Medium"
            })
        }
    }, [ticket])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.title.trim() || !formData.description.trim()) return

        try {
            setIsLoading(true)
            await updateTicket(projectId, ticket._id, formData)
            toast.success("Ticket updated successfully")
            onOpenChange(false)
            onSuccess?.()
        } catch (error) {
            console.error("Failed to update ticket:", error)
            toast.error(error.response?.data?.message || "Failed to update ticket")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-card border-white/10">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Edit Ticket</DialogTitle>
                    <DialogDescription>
                        Make changes to your ticket. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="bg-white/5 border-white/10"
                            required
                        />
                    </div>
                    <div className="space-y-2">
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
                        <div className="space-y-2">
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
                        <div className="space-y-2">
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
                    <DialogFooter className="pt-4">
                        <div className="flex justify-end gap-3 w-full">
                            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Changes"}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default EditTicketModal
