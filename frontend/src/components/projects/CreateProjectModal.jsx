import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { buildProject } from "@/api/projects.api"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const CreateProjectModal = ({ open, onOpenChange, onSuccess }) => {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!title.trim()) return

        try {
            setIsSubmitting(true)
            const result = await buildProject({
                title: title.trim(),
                description: description.trim()
            })

            if (result) {
                toast.success("Project created successfully")
                setTitle("")
                setDescription("")
                onSuccess()
                onOpenChange(false)
            }
        } catch (error) {
            console.error("Failed to create project:", error)
            // Error toast is handled by client.js interceptor
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-background border-white/10">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create New Project</DialogTitle>
                        <DialogDescription>
                            Enter the details for your new project. You can add members later.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Project Title</Label>
                            <Input
                                id="title"
                                placeholder="e.g. Website Redesign"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={isSubmitting}
                                className="bg-white/5 border-white/10 focus:border-primary/50"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="What is this project about?"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={isSubmitting}
                                className="bg-white/5 border-white/10 focus:border-primary/50 resize-none"
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !title.trim() || !description.trim()}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Project"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateProjectModal
