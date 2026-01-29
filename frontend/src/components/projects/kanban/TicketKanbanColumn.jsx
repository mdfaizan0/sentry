import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { ScrollArea } from "@/components/ui/scroll-area"
import DraggableTicketCard from "./DraggableTicketCard"
import { cn } from "@/lib/utils"
import { Circle, Clock, CheckCircle2 } from "lucide-react"

const statusConfig = {
    "Open": {
        label: "To Do",
        color: "bg-slate-500/10 text-slate-300 border-slate-400/30",
        icon: Circle,
        barColor: "bg-slate-400",
        borderColor: "border-slate-400/40",
        bgGradient: "bg-gradient-to-br from-slate-500/5 to-slate-600/10"
    },
    "In Progress": {
        label: "In Progress",
        color: "bg-amber-500/10 text-amber-300 border-amber-400/30",
        icon: Clock,
        barColor: "bg-amber-400",
        borderColor: "border-amber-400/40",
        bgGradient: "bg-gradient-to-br from-amber-500/5 to-amber-600/10"
    },
    "Closed": {
        label: "Done",
        color: "bg-emerald-500/10 text-emerald-300 border-emerald-400/30",
        icon: CheckCircle2,
        barColor: "bg-emerald-400",
        borderColor: "border-emerald-400/40",
        bgGradient: "bg-gradient-to-br from-emerald-500/5 to-emerald-600/10"
    }
}

const TicketKanbanColumn = ({ id, tickets, isOwner, currentUserId, onTicketClick }) => {
    const { setNodeRef } = useDroppable({ id })
    const config = statusConfig[id] || statusConfig["Open"]
    const Icon = config.icon

    return (
        <div className={cn(
            "flex flex-col h-full flex-1 min-w-[340px] rounded-2xl border-2 border-dashed overflow-hidden shadow-lg shadow-black/5 transition-all hover:shadow-xl",
            config.borderColor,
            config.bgGradient
        )}>
            {/* Column Header */}
            <div className={cn("p-5 border-b-2 border-dashed flex items-center justify-between backdrop-blur-sm", config.borderColor)}>
                <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg border-2", config.color)}>
                        <Icon size={18} className="drop-shadow-sm" />
                    </div>
                    <span className="font-bold text-base tracking-tight">{config.label}</span>
                </div>
                <div className={cn("text-sm font-bold px-3 py-1 rounded-full border-2", config.color)}>
                    {tickets.length}
                </div>
            </div>

            {/* Droppable Area */}
            <div ref={setNodeRef} className="flex-1 overflow-hidden relative">
                <ScrollArea className="h-full w-full">
                    <div className="p-4 space-y-3 min-h-[150px]">
                        <SortableContext items={tickets.map(t => t._id)} strategy={verticalListSortingStrategy}>
                            {tickets.map((ticket) => (
                                <DraggableTicketCard
                                    key={ticket._id}
                                    ticket={ticket}
                                    isOwner={isOwner}
                                    currentUserId={currentUserId}
                                    onClick={onTicketClick}
                                />
                            ))}
                        </SortableContext>
                        {tickets.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground/40">
                                <Icon size={32} className="mb-2 opacity-30" />
                                <span className="text-xs font-medium">No tickets</span>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                {/* Colored Bottom Bar Accent */}
                <div className={cn("absolute bottom-0 left-0 right-0 h-0.5 opacity-50", config.barColor)} />
            </div>
        </div>
    )
}

export default TicketKanbanColumn
