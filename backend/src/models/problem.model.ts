import { z } from "zod";

export const CreateProblemSchema = z.object({
    body: z.object({
        id: z.string({ message: 'The ID is required' }).min(3, 'The ID must have at least 3 charaters').max(20, 'The ID cannot have more than 20 characters')
    })
})