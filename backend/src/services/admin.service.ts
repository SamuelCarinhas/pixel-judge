import { Role } from "@prisma/client";
import prisma from "../utils/prisma.util";
import { BadRequest, Conflict, NotFound } from "../utils/error.util";
import { AccountWithProfile } from "../utils/types.util";
import logger from "../utils/logger.util";
import { AdminUpdateProblemSchema } from "../models/admin.model";
import { z } from "zod";
import { readFileSync, readSync, rmSync } from "fs";

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

    logger.admin(`${currentAccount.username} created problem ${id}`, currentAccount)
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

    if(!problem) throw new NotFound('Problem not found')

    return problem
}

export async function updateProblem(currentAccount: AccountWithProfile, id: string, input: z.infer<typeof AdminUpdateProblemSchema>['body']) {
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


    logger.admin(`${currentAccount.username} updated problem ${id}`, currentAccount)

    return updatedProblem
}

export async function addTestCase(currentAccount: AccountWithProfile, problemID: string, inputFile: Express.Multer.File, outputFile: Express.Multer.File) {
    const problem = await prisma.problem.findUnique({ where: { id: problemID } })
    if(!problem) throw new NotFound("Problem not found");

    const testCase = await prisma.problemTestCase.create({
        data: {
            inputFilePath: inputFile.path,
            outputFilePath: outputFile.path,
            problemId: problem.id
        }
    })

    logger.admin(`${currentAccount.username} added a test case to problem ${problem.id}`, currentAccount);

    return testCase
}

export async function removeTestCase(currentAccount: AccountWithProfile, id: string) {
    const testCase = await prisma.problemTestCase.findUnique({ where: { id }, include: { problem: true } })
    if(!testCase) throw new NotFound("Test case not found")
    
    rmSync(testCase.inputFilePath)
    rmSync(testCase.outputFilePath)

    await prisma.problemTestCase.delete({ where: { id } })

    logger.admin(`${currentAccount.username} deleted a test case from ${testCase.problem.id}`, currentAccount);
}

export async function editTestCase(currentAccount: AccountWithProfile, testCaseID: string, inputFile: Express.Multer.File, outputFile: Express.Multer.File) {
    let testCase = await prisma.problemTestCase.findUnique({ where: { id: testCaseID }, include: { problem: true } })
    if(!testCase) throw new NotFound("Test case not found");

    rmSync(testCase.inputFilePath)
    rmSync(testCase.outputFilePath)

    testCase = await prisma.problemTestCase.update({
        where: {
            id: testCase.id
        },
        data: {
            inputFilePath: inputFile.path,
            outputFilePath: outputFile.path,
        },
        include: {
            problem: true
        }
    })

    logger.admin(`${currentAccount.username} updated a test case on problem ${testCase.problem.id}`, currentAccount);
    return testCase
}

export async function getTestCases(problemId: string) {
    const problem = await prisma.problem.findUnique({ where: { id: problemId } })
    if(!problem) throw new NotFound("Problem not found");

    const testCases = await prisma.problemTestCase.findMany({ where: { problemId }, include: { problem: true }, orderBy: { createdAt: 'asc' } })

    return testCases
}

export async function getTestCase(id: string) {
    const testCase = await prisma.problemTestCase.findUnique({ where: { id } })
    if(!testCase) throw new NotFound("Test case not found");

    const res = {
        input: readFileSync(testCase.inputFilePath, 'utf8'),
        output: readFileSync(testCase.outputFilePath, 'utf8')
    }

    return res
}

export async function changeTestCaseVisibility(currentAccount: AccountWithProfile, id: string, visible: boolean) {
    let testCase = await prisma.problemTestCase.findUnique({ where: { id }, include: { problem: true } })
    if(!testCase) throw new NotFound("Test case not found");

    if(visible === testCase.visible) return testCase;

    testCase = await prisma.problemTestCase.update({
        where: {
            id: testCase.id
        },
        data: {
            visible
        },
        include: {
            problem: true
        }
    })

    logger.admin(`${currentAccount.username} changed a test case visibility on problem ${testCase.problem.id}`, currentAccount)
    return testCase
}

export async function getLanguages() {
    let languages = await prisma.language.findMany({  });

    return languages;
}

export async function getLanguage(id: string) {
    let language = await prisma.language.findUnique({ where: { id } });
    if(!language) throw new NotFound({ id: "Language not found "});

    return language;
}

export async function addLanguage(currentAccount: AccountWithProfile, fileExtension: string, id: string, compile: boolean, compileCommand: string, runCommand: string) {
    const language = await prisma.language.create({
        data: {
            id,
            fileExtension,
            compile,
            compileCommand,
            runCommand
        }
    })

    logger.admin(`${currentAccount.username} added a new language: ${language.id}`, currentAccount)
    return language
}

export async function updateLanguage(currentAccount: AccountWithProfile, fileExtension: string, id: string, compile: boolean, compileCommand: string, runCommand: string) {
    let language = await prisma.language.findUnique({ where: { id } })
    if(!language) throw new NotFound({ id: "Language not found"});

    language = await prisma.language.update({
        where: {
            id
        },
        data: {
            id,
            fileExtension,
            compile,
            compileCommand,
            runCommand
        }
    })

    logger.admin(`${currentAccount.username} updated language ${language.id}`, currentAccount)

    return language
}

export default {
    getUsers,
    updateUser,
    getLogs,
    createProblem,
    getProblem,
    getProblems,
    updateProblem,
    getTestCase,
    getTestCases,
    editTestCase,
    removeTestCase,
    addTestCase,
    changeTestCaseVisibility,
    getLanguage,
    getLanguages,
    addLanguage,
    updateLanguage
}