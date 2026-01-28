import { useState } from "react"
import TicketCard from "./TicketCard"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Ticket } from "lucide-react"
import TicketDetailModal from "./TicketDetailModal"

export const TicketSkeleton = () => (
    <Card className="bg-card/40 border-white/5 shadow-none overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/5" />
        <CardContent className="p-4 pl-5 space-y-3">
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-3 w-12" />
                </div>
                <Skeleton className="h-5 w-3/4" />
                <div className="space-y-1">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-3 w-16" />
            </div>
        </CardContent>
    </Card>
)

const TicketList = ({ tickets, isLoading, projectId, isOwner, members, onRefresh }) => {
    const [selectedTicket, setSelectedTicket] = useState(null)
    const [isDetailOpen, setIsDetailOpen] = useState(false)

    const handleTicketClick = (ticket) => {
        setSelectedTicket(ticket)
        setIsDetailOpen(true)
    }

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                    <TicketSkeleton key={i} />
                ))}
            </div>
        )
    }

    if (!tickets || tickets.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-xl border-white/10 bg-white/5 text-center">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4 text-muted-foreground/50">
                    <Ticket size={24} />
                </div>
                <p className="text-lg font-medium">No tickets yet for this project</p>
                <p className="text-sm text-muted-foreground mt-1 max-w-[250px]">
                    Create a new ticket to start tracking issues and tasks.
                </p>
            </div>
        )
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tickets.map((ticket) => (
                    <TicketCard
                        key={ticket._id}
                        ticket={ticket}
                        onClick={handleTicketClick}
                    />
                ))}
            </div>

            {selectedTicket && (
                <TicketDetailModal
                    open={isDetailOpen}
                    onOpenChange={setIsDetailOpen}
                    ticketId={selectedTicket._id}
                    projectId={projectId}
                    isOwner={isOwner}
                    members={members}
                    onSuccess={onRefresh}
                />
            )}
        </>
    )
}

export default TicketList
