export function emailVerificationTemplate(
  verificationUrl: string,
  name?: string
): string {

  const userName = name || "there";
  const currentYear = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify Your Email</title>
</head>

<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f4;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 20px 0;">
    <tr>
      <td align="center">

        <!-- Email Card -->
        <table width="600" cellpadding="0" cellspacing="0"
          style="background:#ffffff; border-radius:10px; padding:30px; box-shadow:0 2px 12px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom:20px;">

              <div style="display:flex; align-items:center; justify-content:center; gap:8px;">

                <!-- Envelope Icon -->
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#333">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>

                <h1 style="margin:0; color:#333; font-size:22px;">
                  Verify Your Email
                </h1>

              </div>

            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="color:#555; font-size:15px; line-height:1.6;">

              <p>Hi <strong>${userName}</strong>,</p>

              <p>
                Thanks for signing up! Please verify your email address by clicking the button below:
              </p>

              <!-- Button -->
              <p style="text-align:center; margin:30px 0;">
                <a href="${verificationUrl}"
                  style="background-color:#3498db;
                         color:#ffffff;
                         padding:12px 28px;
                         text-decoration:none;
                         border-radius:6px;
                         display:inline-block;
                         font-weight:bold;">
                  Verify Email
                </a>
              </p>

              <p>Or copy and paste this link:</p>

              <p style="word-break:break-all;
                        background:#f8f9fa;
                        padding:10px;
                        border-radius:5px;
                        font-family:monospace;
                        font-size:13px;">
                ${verificationUrl}
              </p>

              <!-- Warning -->
              <p style="color:#e74c3c; font-weight:bold; display:flex; align-items:center; gap:6px;">

                <!-- Warning Icon -->
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#e74c3c">
                  <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                </svg>

                This link will expire in 5 minutes.
              </p>

              <p>If you didn't create an account, you can safely ignore this email.</p>

              <hr style="border:0; border-top:1px solid #eee; margin:30px 0;" />

              <p style="margin:0;">
                Best regards,<br>
                <strong>FileSharing App Team</strong>
              </p>

            </td>
          </tr>

        </table>

        <!-- Footer -->
        <p style="font-size:12px; color:#999; margin-top:20px;">
          © ${currentYear} FileSharing App. All rights reserved.
        </p>

      </td>
    </tr>
  </table>

</body>
</html>
  `;
}