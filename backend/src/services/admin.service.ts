import prisma from "../utils/prisma.util";

export async function getUsers() {
    const users = await prisma.account.findMany({
        select: {
            username: true,
            createdAt: true,
            email: true,
            role: true,
            verified: true,
        }
    })

    return users;
}

export default {
    getUsers
}