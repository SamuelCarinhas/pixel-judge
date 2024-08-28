import { Request, Response, NextFunction } from "express"

import { APIError } from "../utils/error.util"
import logger from "../utils/logger.util"

const ENV = String(process.env.NODE_ENV)

export function errorHandler(err: APIError, req: Request, res: Response, next: NextFunction) {
    err.status >= 500 ? logger.error(err) : logger.info(err)
    res.status(err.status).json({
        error: err.name,
        status: err.status,
        description: err.message,
        ...err.detail,
        stack: ENV === "development" ? err.stack : {},
    })
}

export default { errorHandler }
