import { Problem } from "@prisma/client";
import { BadRequest, Conflict, NotFound } from "../utils/error.util";
import prisma from "../utils/prisma.util"
import { AccountWithProfile } from "../utils/types.util";

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
    return await prisma.problem.findMany({ select: { id: true, title: true } })
}

export default {
    createProblem,
    getProblems
}
