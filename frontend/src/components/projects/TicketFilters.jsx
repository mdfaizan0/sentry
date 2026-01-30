import { useState, useEffect } from "react"
import { Search, X, Filter, User as UserIcon, AlertCircle, Circle, Clock, CheckCircle2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const statusConfig = {
    "Open": { color: "text-sky-400 border-sky-400/20", icon: Circle },
    "In Progress": { color: "text-amber-400 border-amber-400/20", icon: Clock },
    "Closed": { color: "text-emerald-400 border-emerald-400/20", icon: CheckCircle2 }
}

const priorityConfig = {
    "Low": { color: "text-slate-400 border-slate-400/20" },
    "Medium": { color: "text-blue-400 border-blue-400/20" },
    "High": { color: "text-rose-400 border-rose-400/20" }
}

const TicketFilters = ({
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    assigneeFilter,
    setAssigneeFilter,
    members,
    onClearFilters
}) => {
    const [localSearch, setLocalSearch] = useState(searchQuery)

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(localSearch)
        }, 300)
        return () => clearTimeout(timer)
    }, [localSearch, setSearchQuery])

    // Sync local search if global search is cleared
    useEffect(() => {
        setLocalSearch(searchQuery)
    }, [searchQuery])

    const hasActiveFilters = searchQuery || statusFilter !== "all" || priorityFilter !== "all" || assigneeFilter !== "all"

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search tickets by title or description..."
                        className="pl-9 bg-white/5 border-white/10 h-10 focus-visible:ring-primary/20"
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                    />
                    {localSearch && (
                        <button
                            onClick={() => setLocalSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* Status Filter */}
                <div className="flex flex-1 gap-2 md:gap-4 flex-wrap md:flex-nowrap">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="flex-1 md:w-[150px] bg-white/5 border-white/10 h-10 text-xs">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-white/10">
                            <SelectItem value="all" className="text-xs font-medium">All Statuses</SelectItem>
                            <SelectItem value="Open" className="text-xs font-medium">Open</SelectItem>
                            <SelectItem value="In Progress" className="text-xs font-medium">In Progress</SelectItem>
                            <SelectItem value="Closed" className="text-xs font-medium">Closed</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Priority Filter */}
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                        <SelectTrigger className="flex-1 md:w-[150px] bg-white/5 border-white/10 h-10 text-xs">
                            <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-white/10">
                            <SelectItem value="all" className="text-xs font-medium">All Priorities</SelectItem>
                            <SelectItem value="Low" className="text-xs font-medium text-slate-400">Low</SelectItem>
                            <SelectItem value="Medium" className="text-xs font-medium text-blue-400">Medium</SelectItem>
                            <SelectItem value="High" className="text-xs font-medium text-rose-400">High</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Assignee Filter */}
                    <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                        <SelectTrigger className="flex-1 md:w-[170px] bg-white/5 border-white/10 h-10 text-xs">
                            <div className="flex items-center gap-2 truncate">
                                <UserIcon size={14} className="text-muted-foreground shrink-0" />
                                <SelectValue placeholder="Assignee" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="bg-card border-white/10">
                            <SelectItem value="all" className="text-xs font-medium">All Assignees</SelectItem>
                            <SelectItem value="unassigned" className="text-xs font-medium">Unassigned</SelectItem>
                            {members?.map(member => (
                                <SelectItem key={member._id} value={member._id} className="text-xs">
                                    {member.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClearFilters}
                            className="h-10 px-3 text-muted-foreground hover:text-rose-400 hover:bg-rose-400/5 transition-colors md:w-auto"
                        >
                            <X size={16} className="mr-2" />
                            Clear
                        </Button>
                    )}
                </div>
            </div>

            {/* Filter Badges */}
            {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/50 mr-1">Active Filters:</span>

                    {searchQuery && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 gap-1 pl-2 pr-1 py-0.5 text-[10px] font-medium uppercase tracking-tight">
                            Search: {searchQuery}
                            <button onClick={() => setSearchQuery("")} className="hover:bg-primary/20 rounded-full p-0.5 ml-1">
                                <X size={10} />
                            </button>
                        </Badge>
                    )}

                    {statusFilter !== "all" && (
                        <Badge variant="secondary" className={cn("bg-white/5 border-white/10 gap-1 pl-2 pr-1 py-0.5 text-[10px] font-medium uppercase tracking-tight", statusConfig[statusFilter]?.color)}>
                            Status: {statusFilter}
                            <button onClick={() => setStatusFilter("all")} className="hover:bg-white/10 rounded-full p-0.5 ml-1">
                                <X size={10} />
                            </button>
                        </Badge>
                    )}

                    {priorityFilter !== "all" && (
                        <Badge variant="secondary" className={cn("bg-white/5 border-white/10 gap-1 pl-2 pr-1 py-0.5 text-[10px] font-medium uppercase tracking-tight", priorityConfig[priorityFilter]?.color)}>
                            Priority: {priorityFilter}
                            <button onClick={() => setPriorityFilter("all")} className="hover:bg-white/10 rounded-full p-0.5 ml-1">
                                <X size={10} />
                            </button>
                        </Badge>
                    )}

                    {assigneeFilter !== "all" && (
                        <Badge variant="secondary" className="bg-white/5 border-white/10 gap-1 pl-2 pr-1 py-0.5 text-[10px] font-medium uppercase tracking-tight text-muted-foreground">
                            Assignee: {assigneeFilter === "unassigned" ? "Unassigned" : (members?.find(m => m._id === assigneeFilter)?.name || "Unknown")}
                            <button onClick={() => setAssigneeFilter("all")} className="hover:bg-white/10 rounded-full p-0.5 ml-1">
                                <X size={10} />
                            </button>
                        </Badge>
                    )}
                </div>
            )}
        </div>
    )
}

export default TicketFilters
