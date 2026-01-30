import { client } from "./client"

export const getDashboardData = async () => {
    try {
        const response = await client.get("/dashboard")
        return response.data
    } catch (error) {
        console.error("Dashboard API Error:", error)
        throw error
    }
}
