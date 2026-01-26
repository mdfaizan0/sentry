import { client } from "./client"

export const listAllTickets = async (projectId, filters = {}) => {
    console.log("projectId", projectId)
    const { data } = await client.get(`/tickets/${projectId}`, { params: filters })
    return data.tickets || []
}

export const getOneTicket = async (projectId, ticketId) => {
    const { data } = await client.get(`/tickets/${projectId}/${ticketId}`)
    return data.ticket || null
}

export const createTicket = async (projectId, ticketData) => {
    const { data } = await client.post(`/tickets/${projectId}`, ticketData)
    return data.ticket || null
}

export const updateTicket = async (projectId, ticketId, ticketData) => {
    const { data } = await client.patch(`/tickets/${projectId}/${ticketId}`, ticketData)
    return data.ticket || null
}

export const deleteTicket = async (projectId, ticketId) => {
    const { data } = await client.delete(`/tickets/${projectId}/${ticketId}`)
    return data.ticket || null
}

export const assignTicket = async (projectId, ticketId, assigneeId) => {
    const { data } = await client.patch(`/tickets/${projectId}/${ticketId}/assign`, { assigneeId })
    return data.ticket || null
}
