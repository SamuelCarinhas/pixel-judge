import { InternalServerError } from "../utils/error.util"
import prisma from "../utils/prisma.util"

export async function health() {
    await prisma.$queryRaw`SELECT 1`.catch((e: Error) => {
        throw new InternalServerError("Database connection failed!")
    })
}

export default { health }
