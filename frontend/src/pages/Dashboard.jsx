import { listAllProjects } from "@/api/projects.api"
import { useAuth } from "@/contexts/auth/useAuth"
import { useEffect, useState } from "react"
import { Link, Navigate } from "react-router-dom"

function Dashboard() {
    const [projects, setProjects] = useState([])
    const { user } = useAuth()

    if (!user) {
        return <Navigate to="/login" />
    }

    useEffect(() => {
        const fetchProjects = async () => {
            const projects = await listAllProjects()
            setProjects(projects)
        }
        fetchProjects()
    }, [])

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome {user.name}</p>
            <h2>Projects</h2>
            <ul>
                {projects.map((project) => (
                    <Link to={`/project/${project._id}`} key={project._id} className="p-2 border border-accent">
                        <h2>{project.title}</h2>
                        <p>{project.description}</p>
                    </Link>
                ))}
            </ul>
        </div>
    )
}

export default Dashboard