import { Role } from "@prisma/client";
import prisma from "../utils/prisma.util";
import { BadRequest, NotFound } from "../utils/error.util";
import { AccountWithProfile } from "../utils/types.util";
import logger from "../utils/logger.util";

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

    if(account.verified !== verified)
        logger.admin(`${username}'s verified status from ${account.verified} to ${verified}`, currentAccount);
    if(account.role !== role)
        logger.admin(`${currentAccount.username} updated ${username}'s role from ${account.role} to ${role}`, currentAccount);
}

export async function getLogs() {
    const logs = await prisma.log.findMany({ orderBy: [ { createdAt: 'desc' } ] })
    return logs
}

export default {
    getUsers,
    updateUser,
    getLogs
}