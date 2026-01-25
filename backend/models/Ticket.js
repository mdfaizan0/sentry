import mongoose from "mongoose"

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        required: true,
        default: "Low"
    },
    status: {
        type: String,
        enum: ["Open", "In Progress", "Closed"],
        required: true,
        default: "Open"
    },
    assignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    }
}, { timestamps: true })

const Ticket = mongoose.model("Ticket", ticketSchema)

export default Ticket