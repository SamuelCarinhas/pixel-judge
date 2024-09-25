import { z } from "zod";

export const PostSchema = z.object({
    body: z.object({
        title: z.string({ message: 'Post title is mandatory' }).min(1, 'Post title must be at least 1 character long'),
        content: z.string({ message: 'Post content is mandatory' }).min(1, 'Post content must be at least 1 character long')
    })
})
