export const inviteEmailTemplate = ({ projectName, inviterName, inviteLink, rejectLink, expiryHours, year }) => {
    // Replace these URLs with your actual hosted PNG/JPG assets
    const logoUrl = "https://i.ibb.co/YFQ0kBHb/svgviewer-output.png";
    const projectIconUrl = "https://i.ibb.co/YFQ0kBHb/svgviewer-output.png";
    const userIconUrl = "https://cdn-icons-png.flaticon.com/512/1077/1077114.png";

    return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Project Invitation - Sentry</title>
    <style>
        body { margin: 0; padding: 0; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; background-color: #0f172a; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
        img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; display: block; }
        table { border-collapse: collapse !important; }
        .btn:hover { opacity: 0.9 !important; }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #0f172a;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.2);">
                    
                    <tr>
                        <td align="center" bgcolor="#22c55e" style="padding: 48px 40px; background: linear-gradient(135deg, #22c55e 0%, #10b981 100%);">
                            <table border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="background: rgba(255,255,255,0.2); border: 2px solid rgba(255,255,255,0.3); border-radius: 12px; padding: 8px;">
                                        <img src="${logoUrl}" width="40" height="40" alt="Sentry" style="display: block;" />
                                    </td>
                                    <td style="padding-left: 15px; font-size: 28px; font-weight: bold; color: #ffffff; letter-spacing: -0.5px;">
                                        Sentry
                                    </td>
                                </tr>
                            </table>
                            <h1 style="margin: 20px 0 0 0; color: #ffffff; font-size: 32px; font-weight: 700;">You're Invited!</h1>
                            <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">Join your team on a new project</p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 40px; background-color: #ffffff;">
                            <p style="font-size: 18px; color: #374151; margin: 0 0 20px 0; font-weight: 600;">Hello there,</p>
                            <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin: 0 0 30px 0;">
                                You've been invited to collaborate on an exciting new project. Your expertise and contribution would be valuable to the team.
                            </p>

                            <table border="0" cellpadding="0" cellspacing="20" width="100%" style="background-color: #f0f8ff; border: 2px solid #22c55e; border-radius: 16px;">
                                <tr>
                                    <td>
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td width="50" valign="top">
                                                    <div style="background-color: #ffffff; border-radius: 10px; padding: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                                                        <img src="${projectIconUrl}" width="20" height="20" alt="Project" />
                                                    </div>
                                                </td>
                                                <td style="padding-left: 15px;">
                                                    <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: bold;">Project Name</div>
                                                    <div style="font-size: 18px; color: #1f2937; font-weight: 600;">${projectName}</div>
                                                </td>
                                            </tr>
                                            <tr><td height="20"></td></tr>
                                            <tr>
                                                <td width="50" valign="top">
                                                    <div style="background-color: #ffffff; border-radius: 10px; padding: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                                                        <img src="${userIconUrl}" width="20" height="20" alt="Inviter" />
                                                    </div>
                                                </td>
                                                <td style="padding-left: 15px;">
                                                    <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: bold;">Invited By</div>
                                                    <div style="font-size: 18px; color: #1f2937; font-weight: 600;">${inviterName}</div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 40px;">
                                <tr>
                                    <td align="center">
                                        <a href="${inviteLink}" class="btn" style="background-color: #22c55e; color: #ffffff; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; display: inline-block; margin-bottom: 10px;">Accept Invitation</a>
                                        &nbsp;
                                        <a href="${rejectLink}" class="btn" style="background-color: #ffffff; color: #6b7280; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; border: 2px solid #e5e7eb; display: inline-block;">Decline</a>
                                    </td>
                                </tr>
                            </table>

                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 30px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px;">
                                <tr>
                                    <td style="padding: 15px; font-size: 14px; color: #92400e; font-weight: 500;">
                                        🕒 This invitation expires in ${expiryHours} hours
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td bgcolor="#f9fafb" style="padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="font-size: 13px; color: #6b7280; margin: 0 0 20px 0;">If you didn't expect this invitation, you can safely ignore this email.</p>
                            <table border="0" cellpadding="0" cellspacing="0" align="center">
                                <tr>
                                    <td bgcolor="#22c55e" style="border-radius: 6px; padding: 4px;">
                                        <img src="${logoUrl}" width="16" height="16" />
                                    </td>
                                    <td style="padding-left: 8px; font-size: 14px; font-weight: bold; color: #374151;">Sentry</td>
                                </tr>
                            </table>
                            <p style="font-size: 12px; color: #9ca3af; margin-top: 15px;">&copy; ${year} Sentry · Project Collaboration Platform</p>
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