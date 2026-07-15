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

export const R2 = {
  R2_BUCKET: process.env.R2_BUCKET,
  R2_ENDPOINT: process.env.R2_ENDPOINT,
  R2_PUBLIC_URL: process.env.R2_PUBLIC_URL,
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
} as const
