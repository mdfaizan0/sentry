import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { User, Clock, AlertCircle, Circle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import getInitials from "@/lib/getInitials"

const statusConfig = {
    "Open": {
        color: "text-sky-400 bg-sky-400/10 border-sky-400/20",
        icon: Circle
    },
    "In Progress": {
        color: "text-amber-400 bg-amber-400/10 border-amber-400/20",
        icon: Clock
    },
    "Closed": {
        color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
        icon: CheckCircle2
    }
}

const priorityConfig = {
    "Low": {
        color: "bg-slate-500",
        border: "border-slate-500/20",
        text: "text-slate-400"
    },
    "Medium": {
        color: "bg-blue-500",
        border: "border-blue-500/20",
        text: "text-blue-400"
    },
    "High": {
        color: "bg-rose-500",
        border: "border-rose-500/20",
        text: "text-rose-400"
    }
}

const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    }).format(new Date(dateString))
}

const TicketCard = ({ ticket, onClick, hideStatus = false }) => {
    const { title, description, status, priority, assignee, createdAt } = ticket

    const StatusIcon = statusConfig[status]?.icon || Circle
    const currentStatus = statusConfig[status] || statusConfig["Open"]
    const currentPriority = priorityConfig[priority] || priorityConfig["Low"]

    return (
        <Card
            onClick={() => onClick?.(ticket)}
            className="group bg-card/40 border-white/5 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 shadow-none overflow-hidden relative cursor-pointer active:scale-[0.98] flex flex-col h-full"
        >
            {/* Priority Sidebar Indicator */}
            <div className={cn("absolute left-0 top-0 bottom-0 w-1", currentPriority.color)} />

            <CardContent className="p-4 pl-5 flex flex-col flex-1 justify-between gap-3">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            {!hideStatus && (
                                <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 border flex items-center gap-1 font-medium", currentStatus.color)}>
                                    <StatusIcon size={10} />
                                    {status}
                                </Badge>
                            )}
                            <span className={cn("text-[10px] font-bold uppercase tracking-wider flex items-center gap-1", currentPriority.text)}>
                                <AlertCircle size={10} />
                                {priority}
                            </span>
                        </div>
                        <h3 className="font-semibold text-sm leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {description || "No description provided."}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-auto">
                    <div className="flex items-center gap-3">
                        {assignee ? (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="flex items-center gap-2 cursor-help">
                                            <div className="h-6 w-6 rounded-full bg-primary/20 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                                                {getInitials(assignee.name)}
                                            </div>
                                            <span className="text-xs text-muted-foreground font-medium truncate max-w-[80px]">
                                                {assignee.name}
                                            </span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom" className="bg-popover border-white/10 z-100">
                                        <div className="flex flex-col gap-0.5">
                                            <p className="font-semibold">{assignee.name}</p>
                                            <p className="text-xs text-muted-foreground">{assignee.email}</p>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ) : (
                            <div className="flex items-center gap-2 text-muted-foreground/40">
                                <div className="h-6 w-6 rounded-full bg-white/5 border border-white/5 flex items-center justify-center">
                                    <User size={10} />
                                </div>
                                <span className="text-[11px] italic">Unassigned</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-1.5 text-muted-foreground/60">
                        <Clock size={10} />
                        <span className="text-[10px] font-medium">{formatDate(createdAt)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default TicketCard
