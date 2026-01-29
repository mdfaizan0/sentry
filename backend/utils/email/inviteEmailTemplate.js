export const inviteEmailTemplate = ({ projectName, inviterName, inviteLink, rejectLink, expiryHours, year }) => {
    const logoUrl = "https://i.ibb.co/YFQ0kBHb/svgviewer-output.png";
    const projectIconUrl = "https://i.ibb.co/VYr0J2rC/svgviewer-output-1.png";
    const userIconUrl = "https://cdn-icons-png.flaticon.com/512/1077/1077114.png";
    const clockIconUrl = "https://cdn-icons-png.flaticon.com/512/2838/2838590.png";

    // Light mode colors from your CSS tokens
    const light = {
        background: "#f8fafc",
        card: "#ffffff",
        cardForeground: "#0f172a",
        primary: "#3b82f6",
        primaryForeground: "#ffffff",
        secondary: "#f1f5f9",
        muted: "#f1f5f9",
        mutedForeground: "#64748b",
        accent: "#f1f5f9",
        border: "#e2e8f0",
        warning: "#f59e0b",
        warningBg: "#fef3c7",
        warningText: "#92400e"
    };

    // Dark mode colors from your CSS tokens
    const dark = {
        background: "#020307",
        card: "#090e16",
        cardForeground: "#e2e8f0",
        primary: "#3b82f6",
        primaryForeground: "#ffffff",
        secondary: "#1e293b",
        muted: "#0f172a",
        mutedForeground: "#94a3b8",
        accent: "#1e293b",
        border: "#1e293b",
        warning: "#f59e0b",
        warningBg: "#422006",
        warningText: "#fbbf24"
    };

    return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title>Project Invitation - Sentry</title>
    <style>
        /* Base styles */
        body { 
            margin: 0; 
            padding: 0; 
            width: 100% !important; 
            -webkit-text-size-adjust: 100%; 
            -ms-text-size-adjust: 100%; 
            background-color: ${light.background};
            font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
        }
        
        img { 
            border: 0; 
            height: auto; 
            line-height: 100%; 
            outline: none; 
            text-decoration: none; 
            display: block; 
        }
        
        table { 
            border-collapse: collapse !important; 
        }
        
        a { 
            text-decoration: none; 
        }

        /* Light mode (default) */
        .email-wrapper { background-color: ${light.background}; }
        .main-card { background-color: ${light.card}; }
        .content-section { background-color: ${light.card}; }
        .text-primary { color: ${light.cardForeground}; }
        .text-muted { color: ${light.mutedForeground}; }
        .invitation-card { background-color: ${light.accent}; border-color: ${light.border}; }
        .icon-box { background-color: ${light.card}; border-color: ${light.border}; }
        .btn-primary { background-color: ${light.primary}; color: ${light.primaryForeground}; }
        .btn-secondary { background-color: transparent; color: ${light.mutedForeground}; border-color: ${light.border}; }
        .warning-box { background-color: ${light.warningBg}; }
        .warning-text { color: ${light.warningText}; }
        .footer-section { background-color: #f8fafc; border-top-color: ${light.border}; }
        .header-bg { background-color: ${light.primary}; }

        /* Dark mode */
        @media (prefers-color-scheme: dark) {
            body { background-color: ${dark.background} !important; }
            .email-wrapper { background-color: ${dark.background} !important; }
            .main-card { background-color: ${dark.card} !important; }
            .content-section { background-color: ${dark.card} !important; }
            .text-primary { color: ${dark.cardForeground} !important; }
            .text-muted { color: ${dark.mutedForeground} !important; }
            .invitation-card { background-color: ${dark.accent} !important; border-color: ${dark.border} !important; }
            .icon-box { background-color: ${dark.secondary} !important; border-color: ${dark.border} !important; }
            .btn-primary { background-color: ${dark.primary} !important; color: ${dark.primaryForeground} !important; }
            .btn-secondary { background-color: ${dark.secondary} !important; color: ${dark.cardForeground} !important; border-color: ${dark.border} !important; }
            .warning-box { background-color: ${dark.warningBg} !important; }
            .warning-text { color: ${dark.warningText} !important; }
            .footer-section { background-color: ${dark.background} !important; border-top-color: ${dark.border} !important; }
        }

        /* Mobile responsive */
        @media only screen and (max-width: 600px) {
            .mobile-padding { padding: 24px !important; }
            .mobile-text { font-size: 13px !important; }
            .mobile-stack { display: block !important; width: 100% !important; }
        }
    </style>
</head>
<body class="email-wrapper">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" class="email-wrapper">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <!-- Main container -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.15);" class="main-card">
                    
                    <!-- Header with gradient -->
                    <tr>
                        <td align="center" class="header-bg" style="padding: 48px 40px; position: relative;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <!-- Logo -->
                                        <table border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td align="center" style="background: rgba(255,255,255,0.2); border: 2px solid rgba(255,255,255,0.3); border-radius: 12px; padding: 10px; backdrop-filter: blur(10px);">
                                                    <img src="${logoUrl}" width="32" height="32" alt="Sentry" style="display: block;" />
                                                </td>
                                                <td style="padding-left: 12px; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
                                                    Sentry
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr><td height="20"></td></tr>
                                <tr>
                                    <td align="center">
                                        <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">You're Invited!</h1>
                                        <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.95); font-size: 16px; font-weight: 400;">Join your team on a new project</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Content section -->
                    <tr>
                        <td class="content-section mobile-padding" style="padding: 48px 40px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <!-- Greeting -->
                                <tr>
                                    <td>
                                        <p class="text-primary" style="font-size: 18px; margin: 0 0 24px 0; font-weight: 600;">Hello there,</p>
                                        <p class="text-muted" style="font-size: 16px; line-height: 1.7; margin: 0 0 32px 0;">
                                            You've been invited to collaborate on an exciting new project. Your expertise and contribution would be valuable to the team.
                                        </p>
                                    </td>
                                </tr>

                                <!-- Invitation card -->
                                <tr>
                                    <td>
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="invitation-card" style="border: 2px solid; border-radius: 16px; overflow: hidden;">
                                            <tr>
                                                <td style="padding: 28px;">
                                                    <!-- Project info -->
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                        <tr>
                                                            <td width="48" valign="top">
                                                                <table border="0" cellpadding="0" cellspacing="0">
                                                                    <tr>
                                                                        <td class="icon-box" style="border: 1px solid; border-radius: 10px; padding: 10px;">
                                                                            <img src="${projectIconUrl}" width="24" height="24" alt="Project" />
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                            <td style="padding-left: 12px;">
                                                                <table border="0" cellpadding="0" cellspacing="0">
                                                                    <tr>
                                                                        <td class="text-muted" style="font-size: 12px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; padding-bottom: 4px;">
                                                                            Project Name
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td class="text-primary" style="font-size: 18px; font-weight: 600; line-height: 1.3;">
                                                                            ${projectName}
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        <tr><td height="20" colspan="2"></td></tr>
                                                        <!-- Inviter info -->
                                                        <tr>
                                                            <td width="48" valign="top">
                                                                <table border="0" cellpadding="0" cellspacing="0">
                                                                    <tr>
                                                                        <td class="icon-box" style="border: 1px solid; border-radius: 10px; padding: 10px;">
                                                                            <img src="${userIconUrl}" width="24" height="24" alt="User" />
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                            <td style="padding-left: 12px;">
                                                                <table border="0" cellpadding="0" cellspacing="0">
                                                                    <tr>
                                                                        <td class="text-muted" style="font-size: 12px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; padding-bottom: 4px;">
                                                                            Invited By
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td class="text-primary" style="font-size: 18px; font-weight: 600; line-height: 1.3;">
                                                                            ${inviterName}
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <tr><td height="32"></td></tr>

                                <!-- Message -->
                                <tr>
                                    <td>
                                        <p class="text-muted" style="font-size: 16px; line-height: 1.7; margin: 0 0 32px 0;">
                                            Ready to get started? Accept the invitation to join the team and access all project resources.
                                        </p>
                                    </td>
                                </tr>

                                <!-- Action buttons -->
                                <tr>
                                    <td align="center">
                                        <table border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td class="mobile-stack" style="padding: 0 6px;">
                                                    <a href="${inviteLink}" class="btn-primary" style="display: inline-block; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; text-align: center; box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);">
                                                        Accept Invitation
                                                    </a>
                                                </td>
                                                <td class="mobile-stack" style="padding: 0 6px;">
                                                    <a href="${rejectLink}" class="btn-secondary" style="display: inline-block; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; text-align: center; border: 2px solid;">
                                                        Decline
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <tr><td height="32"></td></tr>

                                <!-- Expiry notice -->
                                <tr>
                                    <td>
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="warning-box" style="border-radius: 12px; border-left: 4px solid ${light.warning};">
                                            <tr>
                                                <td style="padding: 16px; text-align: center;">
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                        <tr>
                                                            <td align="center">
                                                                <img src="${clockIconUrl}" width="20" height="20" alt="Clock" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />
                                                                <span class="warning-text" style="font-size: 14px; font-weight: 600; display: inline-block; vertical-align: middle;">
                                                                    This invitation expires in ${expiryHours} hours
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td class="footer-section" style="padding: 32px 40px; text-align: center; border-top: 1px solid;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <p class="text-muted" style="font-size: 14px; margin: 0 0 24px 0; line-height: 1.6;">
                                            If you didn't expect this invitation, you can safely ignore this email.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 16px 0; border-top: 1px solid ${light.border};">
                                        <table border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="background-color: ${light.primary}; border-radius: 6px; padding: 6px;">
                                                    <img src="${logoUrl}" width="16" height="16" alt="Sentry" />
                                                </td>
                                                <td class="text-primary" style="padding-left: 10px; font-size: 14px; font-weight: 700;">
                                                    Sentry
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <p class="text-muted" style="font-size: 13px; margin: 12px 0 0 0;">
                                            © ${year} Sentry · Project Collaboration Platform
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
};