import { z } from "zod";

export const PasswordSchema = z.string()
    .min(1)
    .refine(password =>
        /[a-z]/.test(password) &&
        /[A-Z]/.test(password) &&
        /[0-9]/.test(password) &&
        /.{8,}/.test(password)
        , {
            message: 'Your password does not fulfill the minimum security requisites.'
        })

export const EmailSchema = z.string()
    .min(1)
    .email("This is not a valid email")

export const UsernameSchema = z.string()
    .min(1)
    .refine(username => !username.includes('@')
        ,{
            message: 'The username cannot contain the character @'
        })

export const SignInSchema = z.object({
    body: z.object({
        identifier: z.string().min(1),
        password: z.string().min(1)
    })
})

export const AskResetPasswordSchema = z.object({
    body: z.object({
        callback: z.string().min(1),
        email: EmailSchema
    })
})

export const SignUpSchema = z.object({
    body: z.object({
        callback: z.string().min(1),
        username: UsernameSchema,
        email: EmailSchema,
        password: PasswordSchema
    })
})

export const ResetPasswordSchema = z.object({
    body: z.object({
        password: PasswordSchema,
        confirmPassword: PasswordSchema
    })
    .refine(data => data.password === data.confirmPassword, {
        message: 'Passwords don\'t match'
    })
})
