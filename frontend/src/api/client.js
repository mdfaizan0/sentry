import axios from "axios"
import { toast } from "sonner"

export const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
})

client.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

client.interceptors.response.use((response) => {
    return response
}, (error) => {
    if (error.response) {
        const { status, data } = error.response
        const message = data?.message || "Something went wrong"

        if (status === 401) {
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            window.location.href = "/login"
        } else {
            toast.error(message)
        }
    } else {
        toast.error("Network error. Please check your connection.")
    }
    return Promise.reject(error)
})