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

export default {
    createProblem,
}
