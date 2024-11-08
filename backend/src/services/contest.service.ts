import { Conflict, NotFound } from "../utils/error.util";
import logger from "../utils/logger.util";
import prisma from "../utils/prisma.util";
import { AccountWithProfile } from "../utils/types.util";

export async function joinContest(currentAccount: AccountWithProfile, problemId: string, id: string) {

}

export async function submitToContest(currentAccount: AccountWithProfile, problemId: string, id: string) {

}

export async function getContests() {
    const contests = await prisma.contest.findMany({});

    return contests;
}

export async function getContest(id: string) {
    const contest = await prisma.contest.findUnique({ where: { id } });
    if(!contest) throw new NotFound("Contest not found");

    return contest;
}

export default {
    joinContest,
    submitToContest,
    getContests,
    getContest
}