import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import adminService from "../services/admin.service";

export async function getUsers(req: Request, res: Response, next: NextFunction) {
    adminService
        .getUsers()
        .then((users) => res.status(StatusCodes.OK).json({ message: "Users retrieved", users }))
        .catch((error) => next(error))
}

export default {
    getUsers
}
