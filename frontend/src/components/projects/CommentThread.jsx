import { useState, useEffect, useRef } from "react"
import { getComments, addComment } from "@/api/comments.api"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, MessageSquare, Send, Reply } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import getInitials from "@/lib/getInitials"
import formatRelativeTime from "@/lib/formatRelativeTime"

const CommentThread = ({ ticketId, projectId }) => {
    const [comments, setComments] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [commentText, setCommentText] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [canComment, setCanComment] = useState(true)
    const [replyingTo, setReplyingTo] = useState(null) // { id, name }
    const commentsEndRef = useRef(null)

    const scrollToBottom = () => {
        commentsEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    // Group comments by parent
    const groupedComments = comments.reduce((acc, comment) => {
        if (!comment.parentId) {
            // Top-level comment
            acc.push({ ...comment, replies: [] })
        } else {
            // Reply - find parent and add to its replies
            const parent = acc.find(c => c._id === comment.parentId)
            if (parent) {
                parent.replies.push(comment)
            }
        }
        return acc
    }, [])

    const fetchCommentsData = async () => {
        try {
            setIsLoading(true)
            const data = await getComments(ticketId)

            if (data.success) {
                setComments(data.comments || [])
                setCanComment(true)
            }
        } catch (error) {
            console.error("Failed to fetch comments:", error)

            // Handle 403 - user not authorized to view/comment
            if (error.response?.status === 403) {
                setCanComment(false)
                setComments([])
            } else {
                toast.error(error.response?.data?.message || "Failed to load comments")
            }
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchCommentsData()
    }, [ticketId])

    const handleSubmit = async (e) => {
        e.preventDefault()

        const trimmedComment = commentText.trim()
        if (!trimmedComment) return

        try {
            setIsSubmitting(true)
            const data = await addComment(ticketId, trimmedComment, replyingTo?.id || null)

            if (data.success) {
                // Optimistic append - add the new comment to the list
                setComments(prev => [...prev, data.comment])
                setCommentText("")
                setReplyingTo(null)
                toast.success(replyingTo ? "Reply added" : "Comment added")

                // Scroll to the new comment
                setTimeout(scrollToBottom, 100)
            }
        } catch (error) {
            console.error("Failed to add comment:", error)

            // Handle 403 - user not authorized to comment
            if (error.response?.status === 403) {
                setCanComment(false)
                toast.error(error.response?.data?.message || "You are not authorized to comment on this ticket")
            } else {
                toast.error(error.response?.data?.message || "Failed to add comment")
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleReply = (commentId, userName) => {
        setReplyingTo({ id: commentId, name: userName })
        // Focus textarea
        document.getElementById("comment-textarea")?.focus()
    }

    const cancelReply = () => {
        setReplyingTo(null)
    }

    const renderComment = (comment, isReply = false) => (
        <Card
            key={comment._id}
            className={cn(
                "p-4 bg-card border-white/5 hover:border-white/10 transition-all",
                isReply && "ml-12 border-l-2 border-l-primary/30"
            )}
        >
            <div className="flex gap-3">
                <Avatar className="w-10 h-10 border border-white/10 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                        {getInitials(comment.userId?.name)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold text-sm text-foreground">
                            {comment.userId?.name || "Unknown User"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {formatRelativeTime(comment.createdAt)}
                        </span>
                        {!isReply && canComment && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleReply(comment._id, comment.userId?.name)}
                                className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground ml-auto"
                            >
                                <Reply size={12} className="mr-1" />
                                Reply
                            </Button>
                        )}
                    </div>
                    <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap wrap-break-word">
                        {comment.comment}
                    </p>
                </div>
            </div>
        </Card>
    )

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <MessageSquare size={18} className="text-muted-foreground" />
                    <h3 className="text-lg font-semibold">Discussion</h3>
                </div>
                <Badge variant="secondary" className="text-xs">
                    {comments.length} {comments.length === 1 ? "comment" : "comments"}
                </Badge>
            </div>

            <Separator />

            {/* Loading State */}
            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="p-4 bg-card border-white/5">
                            <div className="flex gap-3 animate-pulse">
                                <div className="w-10 h-10 rounded-full bg-white/5" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-white/5 rounded w-1/4" />
                                    <div className="h-3 bg-white/5 rounded w-3/4" />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <>
                    {/* Comment List */}
                    {groupedComments.length > 0 ? (
                        <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                            {groupedComments.map((comment) => (
                                <div key={comment._id} className="space-y-3">
                                    {/* Parent Comment */}
                                    {renderComment(comment, false)}

                                    {/* Replies */}
                                    {comment.replies && comment.replies.length > 0 && (
                                        <div className="space-y-3">
                                            {comment.replies.map(reply => renderComment(reply, true))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div ref={commentsEndRef} />
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-lg">
                            <MessageSquare size={40} className="mx-auto mb-3 text-muted-foreground/30" />
                            <p className="text-sm text-muted-foreground">
                                No comments yet. Start the discussion.
                            </p>
                        </div>
                    )}

                    {/* Add Comment Form */}
                    {canComment ? (
                        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
                            {replyingTo && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-white/5 px-3 py-2 rounded-lg">
                                    <Reply size={12} />
                                    <span>Replying to <span className="font-semibold text-foreground">{replyingTo.name}</span></span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={cancelReply}
                                        className="h-5 px-2 ml-auto text-xs"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            )}
                            <Textarea
                                id="comment-textarea"
                                placeholder={replyingTo ? "Write a reply..." : "Add a comment..."}
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                disabled={isSubmitting}
                                className="min-h-[100px] resize-none bg-white/5 border-white/10 focus:border-primary/50"
                            />
                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={!commentText.trim() || isSubmitting}
                                    className="gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Posting...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={16} />
                                            {replyingTo ? "Reply" : "Comment"}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    ) : (
                        /* No Permission Message */
                        <div className="text-center py-6 bg-destructive/5 border border-destructive/20 rounded-lg">
                            <p className="text-sm text-destructive font-medium">
                                You are not allowed to comment on this ticket
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default CommentThread
