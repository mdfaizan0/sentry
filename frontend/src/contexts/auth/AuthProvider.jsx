import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser))
            } catch (e) {
                console.error("Failed to parse user from localStorage", e)
                localStorage.removeItem("user")
            }
        }
        setIsLoading(false)
    }, [])

    const userLogin = (userData) => {
        const { user, token } = userData;
        setUser(user)
        localStorage.setItem("user", JSON.stringify(user))
        localStorage.setItem("token", token)
    }

    const userLogout = () => {
        setUser(null)
        localStorage.removeItem("user")
        localStorage.removeItem("token")
    }

    return (
        <AuthContext.Provider value={{ user, setUser, userLogin, userLogout, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}