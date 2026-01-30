import { useEffect, useState } from "react"
import { useSearchParams, useNavigate, useParams, Link } from "react-router-dom"
import { acceptInvite, rejectInvite } from "@/api/projects.api"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const InviteHandler = () => {
    const { action } = useParams() // 'accept' or 'reject'
    const [searchParams] = useSearchParams()
    const token = searchParams.get("token")

    const navigate = useNavigate()
    const [status, setStatus] = useState("loading") // loading, success, error
    const [message, setMessage] = useState("Processing your request...")

    useEffect(() => {
        const processInvite = async () => {
            if (!token) {
                setStatus("error")
                setMessage("Invalid invitation link. Token is missing.")
                return
            }

            try {
                if (action === "accept") {
                    await acceptInvite(token)
                    setStatus("success")
                    setMessage("You have successfully joined the project!")
                } else if (action === "reject") {
                    await rejectInvite(token)
                    setStatus("success")
                    setMessage("You have declined the invitation.")
                } else {
                    setStatus("error")
                    setMessage("Invalid action.")
                }
            } catch (error) {
                setStatus("error")
                setMessage(error.response?.data?.message || "Failed to process invitation.")
            }
        }

        processInvite()
    }, [action, token])

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <Card className="w-full max-w-md border-white/10 bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        {status === "loading" && (
                            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                                <Loader2 className="h-6 w-6 text-primary animate-spin" />
                            </div>
                        )}
                        {status === "success" && (
                            <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                                <CheckCircle2 className="h-6 w-6 text-green-500" />
                            </div>
                        )}
                        {status === "error" && (
                            <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center">
                                <XCircle className="h-6 w-6 text-red-500" />
                            </div>
                        )}
                    </div>
                    <CardTitle className="text-2xl">
                        {status === "loading" && "Processing Invitation"}
                        {status === "success" && (action === "accept" ? "Welcome Aboard!" : "Invitation Declined")}
                        {status === "error" && "Something went wrong"}
                    </CardTitle>
                    <CardDescription>
                        {message}
                    </CardDescription>
                </CardHeader>


                <CardFooter className="flex justify-center gap-4">
                    {status === "loading" ? (
                        <p className="text-sm text-muted-foreground animate-pulse">Please wait...</p>
                    ) : (
                        <>
                            {(status === "success" && action === "accept") ? (
                                <Button onClick={() => navigate("/dashboard")} className="w-full">
                                    Go to Dashboard
                                </Button>
                            ) : (
                                <Button asChild variant="outline" className="w-full">
                                    <Link to="/">Go Home</Link>
                                </Button>
                            )}
                        </>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}

export default InviteHandler
