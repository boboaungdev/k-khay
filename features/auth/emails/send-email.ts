import { APP_INFO, SMTP } from "@/constatnts"
import { transporter } from "@/lib/mail"

export function sendAuthEmail(payload: {
  to: string
  subject: string
  html: string
}) {
  return transporter.sendMail({
    from: {
      name: APP_INFO.appName,
      address: SMTP.SMTP_EMAIL_FROM,
    },
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
  })
}
