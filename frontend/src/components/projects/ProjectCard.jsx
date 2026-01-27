import { Link } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, Users, Crown } from "lucide-react"
import { motion } from "framer-motion"

const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).format(new Date(dateString))
}

export const ProjectSkeleton = () => (
    <Card className="h-[180px] bg-card/50 border-white/5 shadow-none flex flex-col">
        <CardHeader className="p-4 pb-2">
            <Skeleton className="h-5 w-1/2 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4 mt-1" />
        </CardHeader>
        <CardFooter className="p-4 pt-0 mt-auto flex items-center gap-4">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-20" />
        </CardFooter>
    </Card>
)

const ProjectCard = ({ project, isLoading, isOwner }) => {
    if (isLoading) return <ProjectSkeleton />

    return (
        <Link
            to={`/project/${project._id}`}
            className="block no-underline group"
        >
            <Card className="h-[180px] bg-card/50 border-white/5 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/5 flex flex-col relative overflow-hidden">
                {isOwner && (
                    <div className="absolute top-0 right-0 px-2 py-1 bg-primary/10 border-l border-b border-primary/20 rounded-bl-lg flex items-center gap-1">
                        <Crown size={10} className="text-primary" />
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Owner</span>
                    </div>
                )}
                <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors truncate pr-12">
                        {project.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 mt-2 text-xs leading-relaxed">
                        {project.description || "No description provided."}
                    </CardDescription>
                </CardHeader>
                <CardFooter className="p-4 pt-0 mt-auto flex items-center gap-4 text-[10px] text-muted-foreground font-medium">
                    <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                        <Users size={12} className="text-primary/70" />
                        <span>
                            {project.members?.length || 0} {project.members?.length === 1 ? 'Member' : 'Members'}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                        <Calendar size={12} className="text-primary/70" />
                        <span>{formatDate(project.createdAt)}</span>
                    </div>
                </CardFooter>
            </Card>
        </Link>
    )
}

export default ProjectCard
