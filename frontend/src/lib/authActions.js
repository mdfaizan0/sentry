import client from "@/api/client"

export async function register(name, email, password) {
    try {
        const { data, error } = await client.post("/auth/register", {
            email,
            password,
            name
        })
        if (error) {
            console.error("Registration error:", error)
            throw error
        }

        return data
    } catch (error) {
        console.error(error)
        throw new Error(error);
    }
}

export async function login(email, password) {
    try {
        const { data, error } = await client.post("/auth/login", {
            email,
            password
        })
        if (error) {
            console.error("Login error:", error)
            throw error
        }

        return data
    } catch (error) {
        console.error(error)
        throw new Error(error);
    }
}