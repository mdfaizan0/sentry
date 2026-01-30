import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import TicketCard from "../TicketCard"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const DraggableTicketCard = ({ ticket, isOwner, currentUserId, onClick }) => {
    const isAssignee = ticket.assignee?._id === currentUserId
    const isAllowed = isOwner || isAssignee

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: ticket._id,
        data: { ticket },
        disabled: !isAllowed,
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    const cardContent = (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none h-full cursor-grab active:cursor-grabbing">
            {/* We use h-full to ensure the wrapper fills the sortable item space */}
            <TicketCard ticket={ticket} onClick={onClick} hideStatus={true} />
        </div>
    )

    if (isAllowed) {
        return cardContent
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="cursor-not-allowed opacity-80 filter grayscale-[0.2]">
                        {/* We don't attach DnD listeners here */}
                        <TicketCard ticket={ticket} onClick={onClick} hideStatus={true} />
                    </div>
                </TooltipTrigger>
                <TooltipContent className="bg-destructive text-destructive-foreground border-destructive/20">
                    <p>Only project owner or assignee can move this ticket</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default DraggableTicketCard
