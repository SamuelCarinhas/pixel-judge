import { Role } from "@prisma/client";
import { z } from "zod";

export const AdminUpdateUserSchem = z.object({
    body: z.object({
        username: z.string().min(1, { message: "Username is required" }),
        verified: z.boolean({ message: "Verified is required"}),
        role: z.enum([Role.ADMIN, Role.MODERATOR, Role.USER], { message: "Wrong role"})
    })
})
