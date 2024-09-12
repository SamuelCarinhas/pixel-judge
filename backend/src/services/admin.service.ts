import { AdminLogType, Role } from "@prisma/client";
import prisma from "../utils/prisma.util";
import { BadRequest, NotFound } from "../utils/error.util";
import { AccountWithProfile } from "../utils/types.util";
import dbLogsUtil from "../utils/db-logs.util";

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
        dbLogsUtil.saveAdminLog(currentAccount, `${currentAccount.username} updated ${username}'s verified status from ${account.verified} to ${verified}`, AdminLogType.UPDATE);
    if(account.role !== role)
        dbLogsUtil.saveAdminLog(currentAccount, `${currentAccount.username} updated ${username}'s role from ${account.role} to ${role}`, AdminLogType.UPDATE);
}

export async function getAdminLogs() {
    const logs = await prisma.adminLog.findMany({ orderBy: [ { createdAt: 'desc' } ] })
    return logs
}

export default {
    getUsers,
    updateUser,
    getAdminLogs
}