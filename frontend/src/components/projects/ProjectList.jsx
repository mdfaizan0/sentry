import ProjectCard, { ProjectSkeleton } from "./ProjectCard"

const ProjectList = ({ projects, isLoading, userId }) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <ProjectSkeleton key={i} />
                ))}
            </div>
        )
    }

    if (projects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-xl border-white/10 bg-white/5 text-center">
                <p className="text-lg font-medium">No projects yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                    Projects you are a member of or own will appear here.
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
                <ProjectCard
                    key={project._id}
                    project={project}
                    isOwner={project.owner === userId}
                />
            ))}
        </div>
    )
}

export default ProjectList
