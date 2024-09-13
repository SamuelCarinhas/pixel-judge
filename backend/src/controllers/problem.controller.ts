import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import problemService from "../services/problem.service"

export async function createProblem(req: Request, res: Response, next: NextFunction) {
    const { id } = req.body;

    problemService
        .createProblem(res.locals.account, id)
        .then(() => res.status(StatusCodes.CREATED).json({ message: "Problem Created" }))
        .catch((error) => next(error))
}

export async function getProblems(_req: Request, res: Response, next: NextFunction) {
    problemService
        .getProblems()
        .then((problems) => res.status(StatusCodes.OK).json({ message: "Problems retrieved", problems }))
        .catch((error) => next(error))
}

export default {
    createProblem,
    getProblems
}
