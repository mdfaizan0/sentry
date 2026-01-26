import { listAllTickets } from "@/api/tickets.api"
import Loading from "@/components/Loading"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

function ProjectDetail() {
    const [tickets, setTickets] = useState([])
    const { projectId } = useParams()

    useEffect(() => {
        async function fetchTickets() {
            const tickets = await listAllTickets(projectId)
            setTickets(tickets)
        }
        fetchTickets()
    }, [projectId])

    if (!tickets) {
        return <Loading />
    }

    if (tickets.length === 0) {
        return <div>No tickets found</div>
    }

    return (
        <div>
            {tickets?.map(ticket => (
                <div key={ticket._id} className="p-2 m-2 bg-amber-200">
                    <h2>{ticket.title}</h2>
                    <p>{ticket.description}</p>
                </div>
            ))}
        </div>
    )
}

export default ProjectDetail