import { client } from "./client"

export const listAllProjects = async () => {
    const { data } = await client.get("/projects")
    if (data.success) return data.projects
    return data.message || []
}

export const getOneProject = async (id) => {
    const { data } = await client.get(`/projects/${id}`)
    if (data.success) return data.project
    return data.message || null
}

export const buildProject = async (projectData) => {
    const { data } = await client.post("/projects", projectData)
    if (data.success) return data.project
    return data.message || null
}

export const updateProject = async (id, projectData) => {
    const { data } = await client.put(`/projects/${id}`, projectData)
    if (data.success) return data.project
    return data.message || null
}

export const deleteProject = async (id) => {
    const { data } = await client.delete(`/projects/${id}`)
    if (data.success) return data.project
    return data.message || null
}

export const addMember = async (id, memberId) => {
    const { data } = await client.post(`/projects/${id}/add-member`, { memberId })
    if (data.success) return data.project
    return data.message || null
}

export const removeMember = async (id, memberId) => {
    const { data } = await client.post(`/projects/${id}/remove-member`, { memberId })
    if (data.success) return data.project
    return data.message || null
}

export const inviteMember = async (id, email, expiryHours) => {
    const { data } = await client.post(`/projects/${id}/invite-member`, { email, expiryHours })
    if (data.success) return data.message
    return data.message || false
}

export const acceptInvite = async (token) => {
    const { data } = await client.post(`/projects/invite/accept?token=${token}`)
    if (data.success) return data.message
    return data.message || false
}

export const rejectInvite = async (token) => {
    const { data } = await client.post(`/projects/invite/reject?token=${token}`)
    if (data.success) return data.message
    return data.message || false
}
