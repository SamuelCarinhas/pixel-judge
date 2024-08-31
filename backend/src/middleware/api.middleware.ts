import { Request, Response, NextFunction } from "express"

import { APIError } from "../utils/error.util"
import logger from "../utils/logger.util"

const ENV = String(process.env.NODE_ENV)

export function errorHandler(err: APIError, _req: Request, res: Response, _next: NextFunction) {
    err.status >= 500 ? logger.error(err) : logger.info(err)
    
    const description = (err.description.constructor === String) ? {
        "root": err.description
    }: err.description;

    res.status(err.status).json({
        error: err.name,
        status: err.status,
        description: description,
        ...err.detail,
        stack: ENV === "development" ? err.stack : {},
    })
}

export default { errorHandler }
