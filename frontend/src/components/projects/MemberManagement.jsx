import { useState, useEffect, useCallback } from "react"
import {
    inviteMember,
    addMember,
    removeMember,
    getAllInvitesByProjectId
} from "@/api/projects.api"
import { searchUsers } from "@/api/users.api"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
    UserPlus,
    Mail,
    Trash2,
    Clock,
    CheckCircle2,
    User,
    Shield,
    Loader2,
    XCircle,
    Copy,
    Check
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const MemberManagement = ({ projectId, members, ownerId, isOwner, onRefresh }) => {
    const [invites, setInvites] = useState([])
    const [isInviting, setIsInviting] = useState(false)
    const [isFetchingInvites, setIsFetchingInvites] = useState(false)
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
    const [inviteEmail, setInviteEmail] = useState("")
    const [isSendingInvite, setIsSendingInvite] = useState(false)
    const [isRemovingMember, setIsRemovingMember] = useState(null)
    const [inviteMode, setInviteMode] = useState("invite") // "invite" or "direct"
    const [userSearchQuery, setUserSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [isSearching, setIsSearching] = useState(false)
    const [isAddingDirect, setIsAddingDirect] = useState(false)

    const fetchInvites = useCallback(async () => {
        if (!isOwner) return
        try {
            setIsFetchingInvites(true)
            const data = await getAllInvitesByProjectId(projectId)
            setInvites(data)
        } catch (error) {
            console.error("Failed to fetch invites:", error)
        } finally {
            setIsFetchingInvites(false)
        }
    }, [projectId, isOwner])

    useEffect(() => {
        fetchInvites()
    }, [fetchInvites])

    const handleInvite = async (e) => {
        e.preventDefault()
        if (!inviteEmail.trim()) return

        try {
            setIsSendingInvite(true)
            await inviteMember(projectId, inviteEmail, 24)
            toast.success(`Invite sent to ${inviteEmail}`)
            setInviteEmail("")
            setIsInviteModalOpen(false)
            fetchInvites()
        } catch (error) {
            console.error("Failed to send invite:", error)
            toast.error(error.response?.data?.message || "Failed to send invite")
        } finally {
            setIsSendingInvite(false)
        }
    }

    const handleSearch = useCallback(async (query) => {
        if (!query || query.length < 2) {
            setSearchResults([])
            return
        }
        try {
            setIsSearching(true)
            const users = await searchUsers(query)
            setSearchResults(users.filter(u => !members.some(m => m._id === u._id)))
        } catch (error) {
            console.error("Search failed:", error)
        } finally {
            setIsSearching(false)
        }
    }, [members])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (userSearchQuery) handleSearch(userSearchQuery)
        }, 300)
        return () => clearTimeout(timer)
    }, [userSearchQuery, handleSearch])

    const handleAddDirect = async (userId) => {
        try {
            setIsAddingDirect(userId)
            await addMember(projectId, userId)
            toast.success("Member added successfully")
            setInviteMode("invite")
            setUserSearchQuery("")
            setSearchResults([])
            setIsInviteModalOpen(false)
            onRefresh?.()
        } catch (error) {
            console.error("Failed to add member:", error)
            toast.error(error.response?.data?.message || "Failed to add member")
        } finally {
            setIsAddingDirect(false)
        }
    }

    const handleRemoveMember = async (memberId) => {
        try {
            setIsRemovingMember(memberId)
            await removeMember(projectId, memberId)
            toast.success("Member removed from project")
            onRefresh?.()
        } catch (error) {
            console.error("Failed to remove member:", error)
        } finally {
            setIsRemovingMember(null)
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold">Project Members</h2>
                    <p className="text-sm text-muted-foreground mt-1">Manage project access and invitations.</p>
                </div>
                {isOwner && (
                    <Button
                        onClick={() => setIsInviteModalOpen(true)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                        <UserPlus size={16} className="mr-2" />
                        Invite Member
                    </Button>
                )}
            </div>

            <div className="grid gap-6">
                <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60">Team Members ({members?.length || 0})</h3>
                    <div className="bg-card border border-white/5 rounded-xl overflow-hidden">
                        <div className="divide-y divide-white/5">
                            {members?.map((member) => (
                                <div key={member._id} className="p-4 flex items-center justify-between group hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-primary/20 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                                            {member.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-foreground">{member.name}</span>
                                                {member._id === ownerId && (
                                                    <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20 h-4 px-1.5 py-0">
                                                        Project Owner
                                                    </Badge>
                                                )}
                                            </div>
                                            <span className="text-xs text-muted-foreground">{member.email}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {isOwner && member._id !== ownerId && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-400 hover:bg-rose-400/10 opacity-0 group-hover:opacity-100 transition-all"
                                                onClick={() => handleRemoveMember(member._id)}
                                                disabled={isRemovingMember === member._id}
                                            >
                                                {isRemovingMember === member._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {isOwner && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60">Pending Invites ({invites.length})</h3>
                            {isFetchingInvites && <Loader2 size={14} className="animate-spin text-muted-foreground" />}
                        </div>

                        {invites.length > 0 ? (
                            <div className="bg-card border border-white/5 rounded-xl overflow-hidden">
                                <div className="divide-y divide-white/5">
                                    {invites.map((invite) => (
                                        <div key={invite._id} className="p-4 flex items-center justify-between group hover:bg-white/5 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-muted-foreground">
                                                    <Mail size={18} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-foreground">{invite.email}</span>
                                                        <Badge variant="secondary" className="text-[10px] bg-white/5 text-muted-foreground border-white/10 px-1.5 py-0 h-4">
                                                            Pending
                                                        </Badge>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">Expires: {new Date(invite.expiresAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="h-24 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-center p-4">
                                <p className="text-xs text-muted-foreground">No pending invitations</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Invite Modal */}
            <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
                <DialogContent className="sm:max-w-md bg-card border-white/10">
                    <DialogHeader>
                        <DialogTitle>Add Team Member</DialogTitle>
                        <DialogDescription>
                            {inviteMode === "invite"
                                ? "Invite a new person via email invitation."
                                : "Search for an existing user to add them directly."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex bg-white/5 p-1 rounded-lg mb-4">
                        <button
                            className={cn("flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all", inviteMode === "invite" ? "bg-white/10 text-white shadow-sm" : "text-muted-foreground hover:text-white")}
                            onClick={() => setInviteMode("invite")}
                        >
                            Invite by Email
                        </button>
                        <button
                            className={cn("flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all", inviteMode === "direct" ? "bg-white/10 text-white shadow-sm" : "text-muted-foreground hover:text-white")}
                            onClick={() => setInviteMode("direct")}
                        >
                            Find User
                        </button>
                    </div>

                    {inviteMode === "invite" ? (
                        <form onSubmit={handleInvite} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="colleague@example.com"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    className="bg-white/5 border-white/10"
                                    required
                                />
                            </div>
                            <DialogFooter className="pt-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setIsInviteModalOpen(false)}
                                    disabled={isSendingInvite}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                    disabled={isSendingInvite}
                                >
                                    {isSendingInvite ? <Loader2 size={16} className="animate-spin mr-2" /> : <UserPlus size={16} className="mr-2" />}
                                    Send invitation
                                </Button>
                            </DialogFooter>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="search">Search Users</Label>
                                <div className="relative">
                                    <Input
                                        id="search"
                                        placeholder="Name or email..."
                                        value={userSearchQuery}
                                        onChange={(e) => setUserSearchQuery(e.target.value)}
                                        className="bg-white/5 border-white/10 pl-9"
                                    />
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                </div>
                            </div>

                            <div className="max-h-[240px] overflow-y-auto space-y-1 rounded-md border border-white/5 p-1">
                                {isSearching ? (
                                    <div className="p-8 flex justify-center">
                                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    searchResults.map(user => (
                                        <div key={user._id} className="p-2 flex items-center justify-between rounded-md hover:bg-white/5 group border border-transparent hover:border-white/5">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{user.name}</span>
                                                <span className="text-xs text-muted-foreground">{user.email}</span>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="h-7 px-2 text-[10px] uppercase font-bold"
                                                onClick={() => handleAddDirect(user._id)}
                                                disabled={!!isAddingDirect}
                                            >
                                                {isAddingDirect === user._id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Add"}
                                            </Button>
                                        </div>
                                    ))
                                ) : userSearchQuery.length >= 2 ? (
                                    <p className="p-4 text-center text-xs text-muted-foreground">No users found</p>
                                ) : (
                                    <p className="p-4 text-center text-xs text-muted-foreground">Type at least 2 characters to search</p>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default MemberManagement
