import { NextFunction, Request, Response } from "express"
import problemService from "../services/problem.service";
import { StatusCodes } from "http-status-codes";

export async function getProblem(req: Request, res: Response, next: NextFunction) {
    const { id } = req.query;

    problemService.getProblem(id as string)
        .then(problem => res.status(StatusCodes.OK).json({ message: `Problem Retrieved`, problem }))
        .catch(error => next(error))
}

export async function getProblems(req: Request, res: Response, next: NextFunction) {

    problemService.getProblems()
        .then(problems => res.status(StatusCodes.OK).json({ message: `Problems Retrieved`, problems }))
        .catch(error => next(error))
}

export async function submitSolution(req: Request, res: Response, next: NextFunction) {
    const solutionFile = req.file as Express.Multer.File;
    const { id  } = req.query;

    problemService.submitSolution(res.locals.account, id as string, solutionFile)
        .then(() => res.status(StatusCodes.OK).json({ message: 'Solution submitted' }))
        .catch(error => next(error))
}

export default {
    getProblem,
    getProblems,
    submitSolution
}
