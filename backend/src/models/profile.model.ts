import { z } from "zod";

export const GetProfileSchema = z.object({
    query: z.object({
        username: z.string().min(1, { message: "Username is required" })
    })
})

export const FollowProfile = z.object({
    body: z.object({
        username: z.string().min(1, { message: "Username is required"})
    })
})

