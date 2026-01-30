import { useNavigate, useRouteError, isRouteErrorResponse, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, ShieldAlert, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"

function Error() {
  const error = useRouteError()
  const navigate = useNavigate()

  let title = "404"
  let message = "The page you're looking for doesn't exist."

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = "404"
      message = "The page you're looking for doesn't exist."
    } else if (error.status === 401) {
      title = "401"
      message = "You're not authorized to see this."
    } else if (error.status === 503) {
      title = "503"
      message = "Looks like our API is down."
    }
  } else if (error instanceof Error) {
    title = "Error"
    message = error.message
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px] -z-10 animate-pulse delay-700" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center space-y-8 max-w-md w-full"
      >
        {/* Icon Container */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
          <div className="relative h-24 w-24 rounded-3xl bg-card border border-white/10 flex items-center justify-center shadow-2xl">
            <ShieldAlert className="h-12 w-12 text-primary" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-7xl font-black tracking-tighter bg-linear-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">
            {title}
          </h1>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Something went wrong</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto hover:bg-white/5 gap-2 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Go Back
          </Button>
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto shadow-lg shadow-primary/20"
          >
            <Link to="/dashboard" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Go to Dashboard
            </Link>
          </Button>
        </div>

        {/* Support Meta */}
        <p className="text-xs text-muted-foreground/40 pt-12">
          If you believe this is a bug, please contact support.
        </p>
      </motion.div>
    </div>
  )
}

export default Error