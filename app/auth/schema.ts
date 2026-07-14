import { z } from "zod"

export const emailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
})

export const signupSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    username: z
      .string()
      .min(6, { message: "Username must be at least 6 characters." })
      .regex(/^[a-zA-Z0-9]+$/, {
        message: "Username can only contain letters and numbers.",
      })
      .transform((val) => val.toLowerCase()),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    rePassword: z.string(),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match.",
    path: ["rePassword"],
  })

export const otpSchema = z.object({
  otp: z.string().min(6, { message: "Verification code must be 6 digits." }),
})
