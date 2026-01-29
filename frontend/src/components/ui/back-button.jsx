import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const BackButton = ({ className, label = "Back", to }) => {
    const navigate = useNavigate()

    const handleBack = () => {
        if (to) {
            navigate(to)
        } else {
            navigate(-1)
        }
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className={cn(
                "group flex items-center gap-2 pl-0 pr-4 text-muted-foreground hover:text-foreground hover:bg-transparent transition-colors",
                className
            )}
        >
            <div className="h-8 w-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 group-hover:text-primary transition-all">
                <ArrowLeft size={16} />
            </div>
            <span className="text-sm font-medium tracking-wide">{label}</span>
        </Button>
    )
}

export default BackButton
