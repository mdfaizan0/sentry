import { client } from "./client"

export const listAllProjects = async () => {
    const { data } = await client.get("/projects")
    return data.projects || []
}

export const getOneProject = async (id) => {
    const { data } = await client.get(`/projects/${id}`)
    return data.project || null
}

export const buildProject = async (projectData) => {
    const { data } = await client.post("/projects", projectData)
    return data.project || null
}

export const updateProject = async (id, projectData) => {
    const { data } = await client.put(`/projects/${id}`, projectData)
    return data.project || null
}

export const deleteProject = async (id) => {
    const { data } = await client.delete(`/projects/${id}`)
    return data.project || null
}

export const addMember = async (id, memberId) => {
    const { data } = await client.post(`/projects/${id}/add-member`, { memberId })
    return data.project || null
}

export const removeMember = async (id, memberId) => {
    const { data } = await client.post(`/projects/${id}/remove-member`, { memberId })
    return data.project || null
}

export const inviteMember = async (id, email, expiryHours) => {
    const { data } = await client.post(`/projects/${id}/invite-member`, { email, expiryHours })
    return data.message
}

export const acceptInvite = async (token) => {
    const { data } = await client.post(`/projects/invite/accept?token=${token}`)
    return data.message
}

export const rejectInvite = async (token) => {
    const { data } = await client.post(`/projects/invite/reject?token=${token}`)
    return data.message
}

export const getAllInvitesByProjectId = async (projectId) => {
    const { data } = await client.get(`/projects/invites/all/${projectId}`)
    return data.invites || []
}
