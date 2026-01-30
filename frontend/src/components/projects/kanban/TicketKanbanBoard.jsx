import { useState, useEffect, useMemo } from "react"
import { Search } from "lucide-react"
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    defaultDropAnimationSideEffects,
} from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { toast } from "sonner"
import TicketKanbanColumn, { TicketKanbanColumnSkeleton } from "./TicketKanbanColumn"
import TicketCard from "../TicketCard"
import { updateTicket } from "@/api/tickets.api"

const columnsId = ["Open", "In Progress", "Closed"]

const TicketKanbanBoard = ({ tickets: initialTickets, originalTickets, isLoading, projectId, isOwner, currentUserId, onTicketUpdate, onTicketClick }) => {
    // Local state for optimistic updates
    const [items, setItems] = useState(initialTickets)
    const [activeId, setActiveId] = useState(null)

    // Sync prop changes to local state (unless dragging)
    useEffect(() => {
        if (!activeId) {
            setItems(initialTickets)
        }
    }, [initialTickets, activeId])

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Prevent accidental drags on click
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    // Group tickets by status
    const columns = useMemo(() => {
        const groups = {
            "Open": [],
            "In Progress": [],
            "Closed": []
        }
        items.forEach(ticket => {
            if (groups[ticket.status]) {
                groups[ticket.status].push(ticket)
            } else {
                // Fallback for unknown status
                groups["Open"].push(ticket)
            }
        })
        return groups
    }, [items])

    const findContainer = (id) => {
        if (columnsId.includes(id)) return id
        const ticket = items.find(t => t._id === id)
        return ticket ? ticket.status : null
    }

    const handleDragStart = (event) => {
        setActiveId(event.active.id)
    }

    const handleDragOver = (event) => {
        const { active, over } = event
        const overId = over?.id

        if (!overId || active.id === overId) return

        const activeContainer = findContainer(active.id)
        const overContainer = findContainer(overId)

        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return
        }

        // Move item to the new container's list in local state for smooth visualization
        setItems((prev) => {
            const overItems = prev.filter(t => t.status === overContainer)
            const overIndex = overItems.findIndex(t => t._id === overId)

            let newIndex
            if (columnsId.includes(overId)) {
                newIndex = overItems.length + 1
            } else {
                const isBelowOverItem =
                    over &&
                    active.rect.current.translated &&
                    active.rect.current.translated.top > over.rect.top + over.rect.height;

                const modifier = isBelowOverItem ? 1 : 0;
                newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
            }

            // Create new array with updated status
            return prev.map(t => {
                if (t._id === active.id) {
                    return { ...t, status: overContainer }
                }
                return t
            })
        })
    }

    const handleDragEnd = async (event) => {
        const { active, over } = event

        if (!over) {
            setActiveId(null)
            return
        }

        const overContainer = findContainer(over.id)
        const oldStatus = initialTickets.find(t => t._id === active.id)?.status

        if (!overContainer || !oldStatus) {
            setActiveId(null)
            return
        }

        // Check if status actually changed
        if (overContainer === oldStatus) {
            setActiveId(null)
            return
        }


        // Status changed - make API call
        setActiveId(null)

        try {
            await updateTicket(projectId, active.id, { status: overContainer })
            toast.success(`Ticket moved to ${overContainer}`)
            setTimeout(() => {
                onTicketUpdate?.()
            }, 100)
        } catch (error) {
            console.error("Failed to update ticket status:", error)
            toast.error("Failed to update status")
            setItems(initialTickets) // Revert on error
        }
    }

    const dropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: '0.5',
                },
            },
        }),
    }

    const activeitem = activeId ? items.find(t => t._id === activeId) : null

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="flex flex-col gap-6">
                {isLoading ? (
                    <div className="flex min-h-[600px] w-full gap-6 overflow-x-auto pb-4 items-stretch">
                        {columnsId.map((colId) => (
                            <TicketKanbanColumnSkeleton key={colId} id={colId} />
                        ))}
                    </div>
                ) : (
                    <>
                        {originalTickets?.length > 0 && initialTickets.length === 0 && (
                            <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-xl border-white/10 bg-white/5 text-center animate-in fade-in zoom-in-95 duration-300">
                                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mb-3 text-muted-foreground/50">
                                    <Search className="h-5 w-5" />
                                </div>
                                <p className="text-base font-medium">No tickets match current filters</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Adjust your filters to see more tickets.
                                </p>
                            </div>
                        )}

                        <div className="flex min-h-[600px] w-full gap-6 overflow-x-auto pb-4 items-stretch">
                            {columnsId.map((colId) => (
                                <TicketKanbanColumn
                                    key={colId}
                                    id={colId}
                                    tickets={columns[colId]}
                                    isOwner={isOwner}
                                    currentUserId={currentUserId}
                                    onTicketClick={onTicketClick}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            <DragOverlay dropAnimation={dropAnimation}>
                {activeitem ? (
                    <div className="w-[320px] opacity-80 rotate-2 cursor-grabbing">
                        <TicketCard ticket={activeitem} hideStatus={true} />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    )
}

export default TicketKanbanBoard
