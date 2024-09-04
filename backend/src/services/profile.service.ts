import { Account, Profile } from "@prisma/client";
import { BadRequest, Conflict, NotFound } from "../utils/error.util";
import prisma from "../utils/prisma.util"
import { AccountWithProfile } from "../utils/types.util";

export async function getProfile(username: string) {
    let account = await prisma.account.findUnique({
        where: {
            username: username
        },
        select: {
            username: true,
            role: true,
            profile: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    birthDate: true,
                    country: true,
                    city: true,
                    organization: true,
                    lastVisit: true,
                    registered: true,
                }
            }
        }
    })

    if (!account || !account.profile) {
        throw new NotFound("User not found")
    }

    const followers = await prisma.follows.count({ where: { followingId: account?.profile.id } })
    const following = await prisma.follows.count({ where: { followerId: account?.profile.id } })

    const { id, ...profileWithoutId } = account.profile;

    return {
        username: account.username,
        role: account.role,
        profile: {
            ...profileWithoutId
        },
        followers,
        following
    };
}

export async function getProfiles() {
    let accounts = await prisma.account.findMany({
        where: {
            verified: true
        },
        select: {
            username: true,
            role: true
        }
    })

    return accounts;
}

export async function followProfile(currentAccount: AccountWithProfile, username: string) {
    let targetAccount = await prisma.account.findUnique({ where: { username }, include: { profile: true } });
    if(!targetAccount) throw new NotFound("Account not found");
    if(!targetAccount.profile) throw new NotFound("This account was not yet validated");

    if(currentAccount.id === targetAccount.id) throw new BadRequest("You cannot follow yourself");

    await prisma.follows.create({
        data: {
            followerId: currentAccount.profile.id,
            followingId: targetAccount.profile.id
        }
    }).catch(() => {
        throw new Conflict("You already followed this account");
    })
}

export async function unfollowProfile(currentAccount: AccountWithProfile, username: string) {
    let targetAccount = await prisma.account.findUnique({ where: { username }, include: { profile: true } });
    if(!targetAccount) throw new NotFound("Account not found");
    if(!targetAccount.profile) throw new NotFound("This account was not yet validated");

    await prisma.follows.deleteMany({
        where: {
            followerId: currentAccount.profile.id,
            followingId: targetAccount.profile.id
        }
    })
}

export async function isFollowing(currentAccount: AccountWithProfile, username: string) {
    let targetAccount = await prisma.account.findUnique({ where: { username }, include: { profile: true } });
    if(!targetAccount) throw new NotFound("Account not found");
    if(!targetAccount.profile) throw new NotFound("This account was not yet validated");

    const follow = await prisma.follows.findFirst({
        where: {
            followerId: currentAccount.profile.id,
            followingId: targetAccount.profile.id
        }
    })
    
    return follow !== null
}

export async function getFollowers(currentAccount: AccountWithProfile) {
    const followers = await prisma.follows.findMany({
        where: {
            followingId: currentAccount.profile.id
        }
    })
    
    return followers
}

export async function getFollowing(currentAccount: AccountWithProfile) {
    const followers = await prisma.follows.findMany({
        where: {
            followerId: currentAccount.profile.id
        }
    })
    
    return followers
}

export default {
    getProfile,
    getProfiles,
    followProfile,
    unfollowProfile,
    isFollowing,
    getFollowers,
    getFollowing
}
