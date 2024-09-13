import { Account, LogType } from "@prisma/client";
import prisma from "./prisma.util";

export async function saveLog(currentAccount: Account, text: string, type: LogType) {
    return await prisma.log.create({
        data: {
            authorId: currentAccount.id,
            text,
            type
        }
    })
}

export default {
    saveLog
}