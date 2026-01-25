import { client } from "./client"

export const listAllTickets = async (projectId) => {
    const { data } = await client.get(`/tickets/${projectId}`)
    if (data.success) return data.tickets
    return data.message || []
}

export const getOneTicket = async (projectId, ticketId) => {
    const { data } = await client.get(`/tickets/${projectId}/${ticketId}`)
    if (data.success) return data.ticket
    return data.message || null
}

export const createTicket = async (projectId, ticketData) => {
    const { data } = await client.post(`/tickets/${projectId}`, ticketData)
    if (data.success) return data.ticket
    return data.message || null
}

export const updateTicket = async (projectId, ticketId, ticketData) => {
    const { data } = await client.patch(`/tickets/${projectId}/${ticketId}`, ticketData)
    if (data.success) return data.ticket
    return data.message || null
}

export const deleteTicket = async (projectId, ticketId) => {
    const { data } = await client.delete(`/tickets/${projectId}/${ticketId}`)
    if (data.success) return data.ticket
    return data.message || null
}

export const assignTicket = async (projectId, ticketId, assigneeId) => {
    const { data } = await client.patch(`/tickets/${projectId}/${ticketId}/assign`, { assigneeId })
    if (data.success) return data.ticket
    return data.message || null
}
