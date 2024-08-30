import { z } from "zod";

export const PasswordSchema = z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(320, { message: "Password must be less than 256 characters"})

export const EmailSchema = z.string()
    .min(1, { message: "Email is mandatory" })
    .max(320, { message: "Email must be less than 320 characters"})
    .email("This is not a valid email")

export const UsernameSchema = z.string()
    .min(3, { message: "Username must be at least 3 characters long"})
    .max(30, { message: "Username must be less than 30 characters"})
    .refine(username => username.search(/^[\w-]+$/) !== -1
        ,{
            message: 'Username should contain only latin letters, digits, underscore or dash characters'
        })

export const SignInSchema = z.object({
    body: z.object({
        username: z.string().min(1, { message: "Username is mandatory" }),
        password: z.string().min(1, { message: "Password is mandatory" })
    })
})

export const AskResetPasswordSchema = z.object({
    body: z.object({
        email: EmailSchema
    })
})

export const SignUpSchema = z.object({
    body: z.object({
        username: UsernameSchema,
        email: EmailSchema,
        password: PasswordSchema
    })
})

export const ResetPasswordSchema = z.object({
    body: z.object({
        password: PasswordSchema
    })
})
