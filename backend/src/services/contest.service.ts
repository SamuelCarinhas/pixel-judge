import { Conflict } from "../utils/error.util";
import logger from "../utils/logger.util";
import prisma from "../utils/prisma.util";
import { AccountWithProfile } from "../utils/types.util";

export async function createContest(currentAccount: AccountWithProfile, title: string, startDate: Date, endDate: Date) {
    const contest = await prisma.contest.create({
        data: {
            title,
            startDate,
            endDate
        }
    }).catch(() => { throw new Conflict({ id: "There is already a contest with this ID" })})

    logger.admin(`${currentAccount.username} created contest ${contest.id}`, currentAccount)
    
    return contest;
}

export async function addContestProblem(currentAccount: AccountWithProfile, problemId: string, id: string) {

}

export async function removeContestProblem(currentAccount: AccountWithProfile, problemId: string, id: string) {

}

export async function joinContest(currentAccount: AccountWithProfile, problemId: string, id: string) {

}

export async function submitToContest(currentAccount: AccountWithProfile, problemId: string, id: string) {

}

export default {
    createContest
}