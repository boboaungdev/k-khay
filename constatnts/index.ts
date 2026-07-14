export const APP_INFO = {
  appName: "K Khay",
  appTagLine: "Explore the World",
} as const

export const DATABASE = {
  DATABASE_URL: process.env.DATABASE_URL,
} as const

export const SMTP = {
  SMTP_EMAIL: process.env.SMTP_EMAIL,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  SMTP_EMAIL_FROM: process.env.SMTP_EMAIL_FROM,
} as const
