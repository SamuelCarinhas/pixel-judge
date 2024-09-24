import { z } from "zod";

export const GetPageQuery = z.object({
    query: z.object({
        page: z.coerce.number({ message: "Page must be a number" }).min(1, { message: "Page must be positive" }).optional()
    })
})
