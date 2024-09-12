import { AdminLogType } from "@prisma/client";
import { AccountWithProfile } from "./types.util";
import prisma from "./prisma.util";

export async function saveAdminLog(currentAccount: AccountWithProfile, text: string, type: AdminLogType) {
    return await prisma.adminLog.create({
        data: {
            authorId: currentAccount.id,
            text,
            type
        }
    })
}

export default {
    saveAdminLog
}