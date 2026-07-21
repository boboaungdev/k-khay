import { APP_INFO } from "@/constatnts"
import { env } from "@/lib/env"
import { transporter } from "@/lib/mail"

export function sendAuthEmail(payload: {
  to: string
  subject: string
  html: string
}) {
  return transporter.sendMail({
    from: {
      name: APP_INFO.appName,
      address: env.SMTP_MAIL_FROM!,
    },
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
  })
}
