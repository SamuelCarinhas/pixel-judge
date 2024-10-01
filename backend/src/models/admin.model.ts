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
        id: z.string({ message: 'ID is required'})
    })
})

export const AdminTestCaseVisibility = z.object({
    query: z.object({
        id: z.string({ message: 'Test case ID is required' })
    }),
    body: z.object({
        visible: z.boolean({ message: 'Value must be a boolean' })
    })
})

export const LanguageSchema = z.object({
    body: z.object({
        id: z.string().min(1, 'The ID must be at least 1 character long'),
        fileExtension: z.string().min(1, 'The file extension must be at least 1 character long'),
        compile: z.boolean({ message: 'The compile flag must be a boolean' }),
        compileCommand: z.string().min(1, 'The compile command must be at least 1 character long'),
        runCommand: z.string().min(1, 'The run command must be at least 1 character long'),
    })
})

export const AdminContestSchema = z.object({
    body: z.object({
        title: z.string().min(3, 'Title cannot be less than 3 characters').max(20, 'Title cannot be more than 20 characters').optional(),
        startDate: z.string()
            .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" })
            .transform((val) => new Date(val).toISOString()),
        endDate: z.string()
            .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" })
            .transform((val) => new Date(val).toISOString())
    })
})
