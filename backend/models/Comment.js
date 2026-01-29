import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    ticketId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default: null
    }
}, { timestamps: true })

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;