import { NotFound } from "../utils/error.util"
import prisma from "../utils/prisma.util"
import { readFile } from 'fs';
import { AccountWithProfile } from "../utils/types.util";

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

export async function getSubmissionInfo(id: string) {
    const submission = await prisma.submission.findUnique({ where: { id } })
    if(!submission) throw new NotFound({ id: "Solution not found" })
    const { solutionPath, ...submissionWithoutPath } = submission;
    const code = readFileContents(solutionPath);
    return {
        ...submissionWithoutPath,
        code
    }
}

export async function getAllSubmissions() {
    const submissions = await prisma.submission.findMany({ orderBy: { createdAt: 'desc', } })
    
    const submissionsWithoutPath = submissions.map(({ solutionPath, ...rest }) => rest);

    return submissionsWithoutPath;
}

export async function getMySubmissions(currentAccount: AccountWithProfile) {
    const submissions = await prisma.submission.findMany({ where: { authorId: currentAccount.id }, orderBy: { createdAt: 'desc', } })
    
    const submissionsWithoutPath = submissions.map(({ solutionPath, ...rest }) => rest);

    return submissionsWithoutPath;
}

export async function getProblemSubmissions(id: string) {
    const submissions = await prisma.submission.findMany({ where: { problemId: id }, orderBy: { createdAt: 'desc', } })
    
    const submissionsWithoutPath = submissions.map(({ solutionPath, ...rest }) => rest);

    return submissionsWithoutPath;
}

export async function getMyProblemSubmissions(currentAccount: AccountWithProfile, id: string) {
    const submissions = await prisma.submission.findMany({ where: { authorId: currentAccount.id, problemId: id }, orderBy: { createdAt: 'desc', } })
    
    const submissionsWithoutPath = submissions.map(({ solutionPath, ...rest }) => rest);

    return submissionsWithoutPath;
}

export async function getRecentProblemSubmissions(currentAccount: AccountWithProfile, id: string) {
    const submissions = await prisma.submission.findMany({ where: { authorId: currentAccount.id, problemId: id }, orderBy: { createdAt: 'desc', }, take: 3 })
    
    const submissionsWithoutPath = submissions.map(({ solutionPath, ...rest }) => rest);

    return submissionsWithoutPath;
}

export default {
    getSubmissionInfo,
    getAllSubmissions,
    getMySubmissions,
    getProblemSubmissions,
    getMyProblemSubmissions,
    getRecentProblemSubmissions
}
