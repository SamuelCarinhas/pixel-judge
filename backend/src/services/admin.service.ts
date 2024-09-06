import { Role } from "@prisma/client";
import prisma from "../utils/prisma.util";
import { BadRequest, NotFound } from "../utils/error.util";
import { AccountWithProfile } from "../utils/types.util";

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

export async function updateUser(currentAccount: AccountWithProfile, username: string, verified: boolean, role: Role) {
    if(currentAccount.username.toLowerCase() === username.toLowerCase())
        throw new BadRequest({ username: "You cannot change your role"});
    
    const account = await prisma.account.findUnique({ where: { username } });

    if(!account) throw new NotFound({ username: "Account not found" });

    await prisma.account.update({
        where: {
            username
        },
        data: {
            verified,
            role
        }
    })
}

export default {
    getUsers,
    updateUser
}