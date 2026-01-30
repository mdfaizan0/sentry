import nodemailer from "nodemailer"
import { inviteEmailTemplate } from "./inviteEmailTemplate.js";
import dotenv from "dotenv"

dotenv.config()

export const sendInviteEmail = async (project, email, token, expiryHours) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.GOOGLE_APP_PASSWORD
            }
        });

        const inviteLink = `${process.env.FRONTEND_URL}/invite/accept?token=${token}`
        const rejectLink = `${process.env.FRONTEND_URL}/invite/reject?token=${token}`

        const emailTemplate = inviteEmailTemplate({
            projectName: project.title,
            inviterName: project.owner.name,
            inviteLink: inviteLink,
            rejectLink: rejectLink,
            expiryHours,
            year: new Date().getFullYear()
        })

        const mailOptions = {
            from: `"Sentry" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `Invitation to join a project`,
            html: emailTemplate
        }

        const info = await transporter.sendMail(mailOptions)
        if (info.accepted.length > 0) {
            
        } else {
            console.log("Invite email failed to send to:", email)
        }
    } catch (error) {
        console.log("Error sending invite email:", error)
    }
}