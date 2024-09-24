import { BadRequest, NotFound } from "../utils/error.util"
import logger from "../utils/logger.util";
import prisma from "../utils/prisma.util"
import { readFile, rmSync } from 'fs';
import { AccountWithProfile } from "../utils/types.util";
import Redis from 'ioredis';
import { io } from "../main";

const REDIS_PASSWORD = String(process.env.REDIS_PASSWORD);

const redis = new Redis({
    host: 'localhost',
    port: 6379,
    password: REDIS_PASSWORD
});

const readFileContents = (filePath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

// Function to process test cases and get file contents
const processTestCases = async (testCases: { inputFilePath: string; outputFilePath: string; }[]) => {
    return Promise.all(testCases.map(async (testCase) => {
        try {
            const inputFile = testCase.inputFilePath;
            const outputFile = testCase.outputFilePath;
            
            const [inputFileContents, outputFileContents] = await Promise.all([
                readFileContents(inputFile),
                readFileContents(outputFile)
            ]);

            return {
                input: inputFileContents,
                output: outputFileContents
            };
        } catch (err) {
            logger.error('Error reading file:', err);
            return {
                input: '',
                output: ''
            };
        }
    }));
};

export async function getProblem(id: string) {
    // TODO: Find only the public ones
    const problem = await prisma.problem.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            title: true,
            memoryLimit: true,
            timeLimit: true,
            problemDescription: true,
            inputDescription: true,
            outputDescription: true,
            restrictions: true,
            testCases: {
                where: {
                    visible: true
                },
                select: {
                    inputFilePath: true,
                    outputFilePath: true
                }
            }
        }
    })

    if(!problem) throw new NotFound('Problem not found')

    const testCasesContents = await processTestCases(problem.testCases);

    return {
        ...problem,
        testCases: testCasesContents
    }
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

export async function submitSolution(currentAccount: AccountWithProfile, id: string, solution: Express.Multer.File) {
    const problem = await prisma.problem.findUnique({ where: { id } })
    if(!problem) {
        rmSync(solution.path)
        throw new NotFound('Problem not found')
    }

    const language = await prisma.language.findFirst({
        where: {
            fileExtension: solution.originalname.split('.').pop()?.toLocaleLowerCase()
        }
    })

    if(!language) throw new BadRequest("Invalid language");

    const submission = await prisma.submission.create({
        data: {
            solutionPath: solution.path,
            authorId: currentAccount.id,
            problemId: problem.id,
            languageId: language.id
        },
        include: {
            author: {
                select: {
                    username: true
                }
            },
            problem: {
                select: {
                    id: true
                }
            },
            language: true
        }
    })

    logger.info(`${currentAccount.username} submitted a solution for problem ${problem.id}`, currentAccount)

    try {
        await redis.publish('ping', 'queue pinged');

        const { solutionPath, ...submissionWithoutPath } = submission;

        io.emit('new_submission', submissionWithoutPath);

        logger.info(`Submissions enqueued`);
    } catch(error) {
        logger.error('Failed to enqueue task:', error);
    }
}

export default {
    getProblem,
    getProblems,
    submitSolution
}
