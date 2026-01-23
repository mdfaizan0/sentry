export const inviteEmailTemplate = ({ projectName, inviterName, inviteLink, rejectLink, expiryHours, year }) => {
    return `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Project Invitation - Sentry</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            line-height: 1.6;
        }

        .email-wrapper {
            width: 100%;
            padding: 40px 20px;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .header {
            position: relative;
            padding: 48px 40px 40px;
            background: linear-gradient(135deg, #22c55e 0%, #10b981 100%);
            text-align: center;
            overflow: hidden;
        }

        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            animation: pulse 8s ease-in-out infinite;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.1); opacity: 0.3; }
        }

        .logo {
            position: relative;
            z-index: 1;
            display: inline-flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
        }

        .logo-icon {
            width: 48px;
            height: 48px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .logo-text {
            font-size: 28px;
            font-weight: 700;
            color: #ffffff;
            letter-spacing: -0.5px;
        }

        .header h1 {
            position: relative;
            z-index: 1;
            margin: 0;
            font-size: 32px;
            font-weight: 700;
            color: #ffffff;
            letter-spacing: -0.5px;
        }

        .header p {
            position: relative;
            z-index: 1;
            margin-top: 8px;
            font-size: 16px;
            color: rgba(255, 255, 255, 0.9);
        }

        .content {
            padding: 48px 40px;
            background: #ffffff;
        }

        .greeting {
            font-size: 18px;
            color: #374151;
            margin-bottom: 24px;
            font-weight: 500;
        }

        .invitation-card {
            margin: 32px 0;
            padding: 28px;
            background: linear-gradient(135deg, #f0f8ff 0%, #e0f2fe 100%);
            border-radius: 16px;
            border: 2px solid #22c55e;
            position: relative;
            overflow: hidden;
        }

        .invitation-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at top right, rgba(34, 197, 94, 0.1), transparent 60%);
            pointer-events: none;
        }

        .card-content {
            position: relative;
            z-index: 1;
        }

        .card-row {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
            gap: 12px;
        }

        .card-row:last-child {
            margin-bottom: 0;
        }

        .icon {
            width: 40px;
            height: 40px;
            background: #ffffff;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            box-shadow: 0 4px 12px rgba(34, 197, 94, 0.15);
        }

        .card-label {
            font-size: 13px;
            color: #6b7280;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .card-value {
            font-size: 18px;
            color: #374151;
            font-weight: 600;
            margin-top: 2px;
        }

        .message {
            font-size: 16px;
            color: #4b5563;
            margin: 28px 0;
            line-height: 1.7;
        }

        .actions {
            margin: 40px 0;
            text-align: center;
        }

        .btn {
            display: inline-block;
            padding: 16px 32px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 600;
            font-size: 16px;
            margin: 8px;
            transition: all 0.3s ease;
            border: 2px solid transparent;
        }

        .btn-accept {
            background: linear-gradient(135deg, #22c55e 0%, #10b981 100%);
            color: #ffffff;
            box-shadow: 0 8px 20px rgba(34, 197, 94, 0.3);
        }

        .btn-reject {
            background: #ffffff;
            color: #6b7280;
            border: 2px solid #e5e7eb;
        }

        .expiry-notice {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 16px;
            background: #fef3c7;
            border-radius: 12px;
            margin-top: 32px;
            border-left: 4px solid #f59e0b;
        }

        .expiry-notice svg {
            flex-shrink: 0;
        }

        .expiry-notice p {
            margin: 0;
            font-size: 14px;
            color: #92400e;
            font-weight: 500;
        }

        .divider {
            height: 1px;
            background: linear-gradient(to right, transparent, #e5e7eb, transparent);
            margin: 40px 0;
        }

        .footer {
            padding: 32px 40px;
            background: #f9fafb;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }

        .footer-text {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 16px;
        }

        .footer-brand {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-top: 20px;
        }

        .footer-brand-icon {
            width: 24px;
            height: 24px;
            background: #22c55e;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .footer-brand-text {
            font-size: 14px;
            color: #374151;
            font-weight: 600;
        }

        .copyright {
            font-size: 13px;
            color: #9ca3af;
            margin-top: 16px;
        }

        @media (prefers-color-scheme: dark) {
            body {
                background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            }

            .container {
                background: #1e293b;
            }

            .content {
                background: #1e293b;
            }

            .greeting {
                color: #d1d5db;
            }

            .invitation-card {
                background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                border: 2px solid #34d399;
            }

            .invitation-card::before {
                background: radial-gradient(circle at top right, rgba(52, 211, 153, 0.15), transparent 60%);
            }

            .icon {
                background: #374151;
            }

            .card-label {
                color: #9ca3af;
            }

            .card-value {
                color: #d1d5db;
            }

            .message {
                color: #9ca3af;
            }

            .btn-accept {
                background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
                color: #0f172a;
            }

            .btn-reject {
                background: #374151;
                color: #d1d5db;
                border: 2px solid #4b5563;
            }

            .expiry-notice {
                background: #422006;
                border-left: 4px solid #f59e0b;
            }

            .expiry-notice p {
                color: #fbbf24;
            }

            .divider {
                background: linear-gradient(to right, transparent, #4b5563, transparent);
            }

            .footer {
                background: #0f172a;
                border-top: 1px solid #4b5563;
            }

            .footer-text {
                color: #9ca3af;
            }

            .footer-brand-icon {
                background: #34d399;
            }

            .footer-brand-text {
                color: #d1d5db;
            }

            .copyright {
                color: #6b7280;
            }
        }

        @media only screen and (max-width: 600px) {
            .email-wrapper {
                padding: 20px 10px;
            }
            
            .container {
                border-radius: 16px;
            }

            .header, .content, .footer {
                padding: 32px 24px;
            }

            .header h1 {
                font-size: 26px;
            }

            .btn {
                display: block;
                margin: 8px 0;
            }

            .invitation-card {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="container">
            <div class="header">
                <div class="logo">
                    <div class="logo-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" opacity="0.9"/>
                            <path d="M2 17L12 22L22 17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>
                            <path d="M2 12L12 17L22 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>
                        </svg>
                    </div>
                    <span class="logo-text">Sentry</span>
                </div>
                <h1>You're Invited!</h1>
                <p>Join your team on a new project</p>
            </div>

            <div class="content">
                <p class="greeting">Hello there,</p>
                
                <p class="message">
                    You've been invited to collaborate on an exciting new project. Your expertise and contribution would be valuable to the team.
                </p>

                <div class="invitation-card">
                    <div class="card-content">
                        <div class="card-row">
                            <div class="icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M3 7L9 4L15 7L21 4V17L15 20L9 17L3 20V7Z" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M9 4V17M15 7V20" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                            <div>
                                <div class="card-label">Project Name</div>
                                <div class="card-value">${projectName}</div>
                            </div>
                        </div>
                        
                        <div class="card-row">
                            <div class="icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="8" r="4" stroke="#22c55e" stroke-width="2"/>
                                    <path d="M6 21V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V21" stroke="#22c55e" stroke-width="2" stroke-linecap="round"/>
                                </svg>
                            </div>
                            <div>
                                <div class="card-label">Invited By</div>
                                <div class="card-value">${inviterName}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <p class="message">
                    Ready to get started? Accept the invitation to join the team and access all project resources.
                </p>

                <div class="actions">
                    <a href="${inviteLink}" class="btn btn-accept">
                        Accept Invitation
                    </a>
                    <a href="${rejectLink}" class="btn btn-reject">
                        Decline
                    </a>
                </div>

                <div class="expiry-notice">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="#f59e0b" stroke-width="2"/>
                        <path d="M12 6V12L16 14" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <p>This invitation expires in ${expiryHours} hours</p>
                </div>
            </div>

            <div class="footer">
                <p class="footer-text">
                    If you didn't expect this invitation, you can safely ignore this email.
                </p>
                
                <div class="divider"></div>
                
                <div class="footer-brand">
                    <div class="footer-brand-icon">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" opacity="0.9"/>
                            <path d="M2 17L12 22L22 17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>
                            <path d="M2 12L12 17L22 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>
                        </svg>
                    </div>
                    <span class="footer-brand-text">Sentry</span>
                </div>
                
                <p class="copyright">
                    © ${year} Sentry · Project Collaboration Platform
                </p>
            </div>
        </div>
    </div>
</body>
</html>
    `
}