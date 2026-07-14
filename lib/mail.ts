import { SMTP } from "@/constatnts"
import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: SMTP.SMTP_EMAIL,
    pass: SMTP.SMTP_PASSWORD,
  },
})
