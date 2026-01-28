import { client } from "./client"

export const searchUsers = async (query) => {
    const { data } = await client.get(`/users/search?query=${query}`)
    return data.users || []
}
