import { Role } from "@prisma/client";
import { z } from "zod";

export const AdminUpdateUserSchem = z.object({
    body: z.object({
        username: z.string().min(1, { message: "Username is required" }),
        verified: z.boolean({ message: "Verified is required"}),
        role: z.enum([Role.ADMIN, Role.MODERATOR, Role.USER], { message: "Wrong role"})
    })
})

export const ProblemDescriptionSchema = z.string()
    .max(10000, { message: "Field must be less than 10000 characters"})
    .optional()

export const AdminUpdateProblemSchema = z.object({
    body: z.object({
        id: z.string({ message: 'Problem ID is required' }),
        title: z.string().min(3, 'Title cannot be less than 3 characters').max(20, 'Title cannot be more than 20 characters').optional(),
        timeLimit: z.number().min(0, 'Time must be positive').max(10000, 'Time cannot exceed 10 seconds').optional(),
        memoryLimit: z.number().min(0, 'Memory must be positive').max(1024, 'Memory cannot exceed 1GB').optional(),
        problemDescription: ProblemDescriptionSchema,
        inputDescription: ProblemDescriptionSchema,
        outputDescription: ProblemDescriptionSchema,
        restrictions: ProblemDescriptionSchema
    })
})

export const AdminProblemGetSchema = z.object({
    query: z.object({
        id: z.string({ message: 'Problem ID is required'})
    })
})