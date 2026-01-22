import { useAuth } from "@/contexts/auth/useAuth"
import { Navigate, Outlet } from "react-router-dom"

function ProtectedRoute() {
    const { user, isLoading } = useAuth()

    if (isLoading) return null
    if (!user) return <Navigate to="/login" />

    return <Outlet />
}

export default ProtectedRoute