import { NotFound } from "../utils/error.util";
import prisma from "../utils/prisma.util"

export async function getProfile(username: string) {
    let account = await prisma.account.findUnique({
        where: {
            username: username
        },
        select: {
            profile: true
        }
    })

    if (!account || !account.profile) {
        throw new NotFound("User not found")
    }


    const { id, accountId, ...profile } = account.profile;

    return profile;
}

export async function getProfiles() {
    let accounts = await prisma.account.findMany({
        where: {
            verified: true
        },
        select: {
            username: true
        }
    })

    return accounts;
}

export default {
    getProfile,
    getProfiles
}
