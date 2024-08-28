import { StatusCodes } from "http-status-codes"

class APIError extends Error {
    public readonly name: string
    public readonly status: StatusCodes
    public readonly detail: any

    constructor(name: string, status: StatusCodes, description: string, detail?: any) {
        super(description)
        this.name = name
        this.status = status
        this.detail = detail
        Error.captureStackTrace(this)
    }
}

class InternalServerError extends APIError {
    constructor(description = "Oops... Something Went Wrong", detail?: any) {
        super("Internal Server Error", StatusCodes.INTERNAL_SERVER_ERROR, description, detail)
    }
}

class BadRequest extends APIError {
    constructor(description = "Oops... Something Went Wrong", detail?: any) {
        super("Bad Request", StatusCodes.BAD_REQUEST, description, detail)
    }
}

class Conflict extends APIError {
    constructor(description = "Oops... Something Went Wrong", detail?: any) {
        super("Conflict", StatusCodes.CONFLICT, description, detail)
    }
}

class NotFound extends APIError {
    constructor(description = "Oops... Something Went Wrong", detail?: any) {
        super("Not Found", StatusCodes.NOT_FOUND, description, detail)
    }
}

class Unauthorized extends APIError {
    constructor(description = "Oops... Something Went Wrong", detail?: any) {
        super("Unauthorized", StatusCodes.UNAUTHORIZED, description, detail)
    }
}

class Forbidden extends APIError {
    constructor(description = "Oops... Something Went Wrong", detail?: any) {
        super("Forbidden", StatusCodes.FORBIDDEN, description, detail)
    }
}

class EntityTooLarge extends APIError {
    constructor(description = "Oops... Something Went Wrong", detail?: any) {
        super("Entity Too Large", StatusCodes.REQUEST_TOO_LONG, description, detail)
    }
}

export { APIError, InternalServerError, BadRequest, Conflict, NotFound, Unauthorized, Forbidden, EntityTooLarge }
