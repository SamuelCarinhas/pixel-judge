import { NotFound } from "../utils/error.util"
import logger from "../utils/logger.util";
import prisma from "../utils/prisma.util"
import { readFile } from 'fs';

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

export default {
    getProblem,
    getProblems
}
