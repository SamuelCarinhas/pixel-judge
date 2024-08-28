import { PrismaClient } from "@prisma/client"

const ENV = process.env.NODE_ENV
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
    globalForPrisma.prisma || new PrismaClient({ log: ["error"], errorFormat: "minimal" })

if (ENV !== "production") globalForPrisma.prisma = prisma

export default prisma
