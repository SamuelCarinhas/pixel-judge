import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import adminService from "../services/admin.service";
import { AdminUpdateProblemSchema } from "../models/admin.model";

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

export async function createProblem(req: Request, res: Response, next: NextFunction) {
    const { id } = req.body;

    adminService
        .createProblem(res.locals.account, id)
        .then(() => res.status(StatusCodes.CREATED).json({ message: "Problem Created" }))
        .catch((error) => next(error))
}

export async function getProblems(_req: Request, res: Response, next: NextFunction) {
    adminService
        .getProblems()
        .then((problems) => res.status(StatusCodes.OK).json({ message: "Problems retrieved", problems }))
        .catch((error) => next(error))
}


export async function updateProblem(req: Request, res: Response, next: NextFunction) {
    const input = AdminUpdateProblemSchema.safeParse({ body: req.body }).data?.body!;

    adminService
        .updateProblem(input.id, input)
        .then((problem) => res.status(StatusCodes.OK).json({ message: "Problem Updated", problem }))
        .catch((error) => next(error))
}

export async function getProblem(req: Request, res: Response, next: NextFunction) {
    const { id } = req.query;

    adminService
        .getProblem(id as string)
        .then((problem) => res.status(StatusCodes.OK).json({ message: "Problem retrieved", problem }))
        .catch((error) => next(error))
}

export default {
    getUsers,
    updateUser,
    getLogs,
    createProblem,
    getProblem,
    getProblems,
    updateProblem
}
