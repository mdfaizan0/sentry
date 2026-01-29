import { useState, useEffect } from "react"
import { updateProject } from "@/api/projects.api"
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
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

const EditProjectModal = ({ open, onOpenChange, project, onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
    })

    useEffect(() => {
        if (project) {
            setFormData({
                title: project.title || "",
                description: project.description || "",
            })
        }
    }, [project])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.title.trim() || !formData.description.trim()) return

        try {
            setIsLoading(true)
            await updateProject(project._id, formData)
            toast.success("Project updated successfully")
            onOpenChange(false)
            onSuccess?.()
        } catch (error) {
            console.error("Failed to update project:", error)
            toast.error("Failed to update project")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-card border-white/10">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Edit Project</DialogTitle>
                    <DialogDescription>
                        Make changes to your project. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Project Title</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g. Website Redesign"
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
                            placeholder="Describe your project..."
                            className="bg-white/5 border-white/10 min-h-[100px]"
                            required
                        />
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

export default EditProjectModal
