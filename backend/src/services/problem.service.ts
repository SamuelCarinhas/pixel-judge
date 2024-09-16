import { NotFound } from "../utils/error.util"
import prisma from "../utils/prisma.util"

export async function getProblem(id: string) {
    // TODO: Find only the public ones
    const problem = await prisma.problem.findUnique({ where: { id }, select: {
        id: true,
        title: true,
        memoryLimit: true,
        timeLimit: true,
        problemDescription: true,
        inputDescription: true,
        outputDescription: true,
        restrictions: true
    }})

    if(!problem) throw new NotFound('Problem not found')

    return problem
}

export async function getProblems() {
    const problems = await prisma.problem.findMany({
        select: {
            id: true,
            title: true
        }
    })

    return problems
}

export default {
    getProblem,
    getProblems
}
