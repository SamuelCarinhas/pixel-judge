import { NotFound } from "../utils/error.util"
import prisma from "../utils/prisma.util"
import { readFile } from 'fs';
import { AccountWithProfile } from "../utils/types.util";
import { paginate } from "../utils/pagination.util";
import { Submission } from "@prisma/client";

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
    const submission = await prisma.submission.findUnique({ where: { id },
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
    if(!submission) throw new NotFound({ id: "Solution not found" })
    const { solutionPath, ...submissionWithoutPath } = submission;
    const code = await readFileContents(solutionPath);
    return {
        ...submissionWithoutPath,
        code
    }
}

export async function getAllSubmissions(page: number = 1) {
    const submissions = await paginate<Submission>(prisma.submission, { page }, {
        orderBy: { createdAt: 'desc' },
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
    
    const submissionsWithoutPath = submissions.data.map(({ solutionPath, ...rest }) => rest);

    return {
        ...submissions,
        data: submissionsWithoutPath
    };
}

export async function getUserSubmissions(username: string) {
    const user = await prisma.account.findUnique({ where: { username } });
    if(!user) throw new NotFound({ username: "Account not found" })
    const submissions = await prisma.submission.findMany({ where: { authorId: user.id }, orderBy: { createdAt: 'desc', },
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
    
    const submissionsWithoutPath = submissions.map(({ solutionPath, ...rest }) => rest);

    return submissionsWithoutPath;
}

export async function getProblemSubmissions(id: string) {
    const submissions = await prisma.submission.findMany({ where: { problemId: id }, orderBy: { createdAt: 'desc', },
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
    
    const submissionsWithoutPath = submissions.map(({ solutionPath, ...rest }) => rest);

    return submissionsWithoutPath;
}

export async function getMyProblemSubmissions(currentAccount: AccountWithProfile, id: string) {
    const submissions = await prisma.submission.findMany({ where: { authorId: currentAccount.id, problemId: id }, orderBy: { createdAt: 'desc', },
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
    
    const submissionsWithoutPath = submissions.map(({ solutionPath, ...rest }) => rest);

    return submissionsWithoutPath;
}

export async function getRecentProblemSubmissions(currentAccount: AccountWithProfile, id: string) {
    const submissions = await prisma.submission.findMany({ where: { authorId: currentAccount.id, problemId: id }, orderBy: { createdAt: 'desc', }, take: 3,
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
    
    const submissionsWithoutPath = submissions.map(({ solutionPath, ...rest }) => rest);

    return submissionsWithoutPath;
}

export default {
    getSubmissionInfo,
    getAllSubmissions,
    getUserSubmissions,
    getProblemSubmissions,
    getMyProblemSubmissions,
    getRecentProblemSubmissions
}
