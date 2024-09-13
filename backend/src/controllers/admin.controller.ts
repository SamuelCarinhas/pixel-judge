import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import adminService from "../services/admin.service";

export async function getUsers(req: Request, res: Response, next: NextFunction) {
    adminService
        .getUsers()
        .then((users) => res.status(StatusCodes.OK).json({ message: "Users retrieved", users }))
        .catch((error) => next(error))
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {
    const { username, verified, role } = req.body;

    adminService
        .updateUser(res.locals.account, username, verified, role)
        .then(() => res.status(StatusCodes.OK).json({ message: "Role updated"}))
        .catch((error) => next(error))
}

export async function getLogs(req: Request, res: Response, next: NextFunction) {
    adminService
        .getLogs()
        .then((logs) => res.status(StatusCodes.OK).json({ message: "Logs retrieveed", logs }))
        .catch((error) => next(error))
}

export default {
    getUsers,
    updateUser,
    getLogs
}
