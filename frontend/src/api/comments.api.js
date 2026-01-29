import { client } from "./client"

export const getComments = async (ticketId) => {
    const response = await client.get(`/comments/${ticketId}`)
    return response.data
}

export const addComment = async (ticketId, comment, parentId = null) => {
    const response = await client.post(`/comments/${ticketId}`, { comment, parentId })
    return response.data
}
