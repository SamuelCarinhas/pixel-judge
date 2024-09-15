import { Role } from "@prisma/client";
import prisma from "../utils/prisma.util";
import { BadRequest, Conflict, NotFound } from "../utils/error.util";
import { AccountWithProfile } from "../utils/types.util";
import logger from "../utils/logger.util";
import { AdminUpdateProblemSchema } from "../models/admin.model";
import { z } from "zod";

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
        logger.admin(`${currentAccount.username} updated ${username}'s verified status from ${account.verified} to ${verified}`, currentAccount);
    if(account.role !== role)
        logger.admin(`${currentAccount.username} updated ${username}'s role from ${account.role} to ${role}`, currentAccount);
}

export async function getLogs() {
    const logs = await prisma.log.findMany({ orderBy: [ { createdAt: 'desc' } ], include: { author: { select: { username: true } } } })
    return logs
}

export async function createProblem(currentAccount: AccountWithProfile, id: string) {
    await prisma.problem.create({
        data: {
            id
        }
    }).catch(() => {
        throw new Conflict({ 'id': "There is already a problem with this id" });
    })
}

export async function getProblems() {
    return await prisma.problem.findMany({ select: { id: true, title: true, public: true } })
}

export async function getProblem(id: string) {
    const problem = await prisma.problem.findUnique({
        where: {
            id
        },
        include: {
            solutions: true,
            testCases: true
        }
    })

    return problem
}

export async function updateProblem(id: string, input: z.infer<typeof AdminUpdateProblemSchema>['body']) {
    const problem = await prisma.problem.findUnique({ where: { id } })
    if(!problem) throw new NotFound("Problem not found");

    const updatedProblem = await prisma.problem.update({
        where: {
            id
        },
        data: {
            ...input
        }
    })

    return updatedProblem
}

export default {
    getUsers,
    updateUser,
    getLogs,
    createProblem,
    getProblems,
    updateProblem
}