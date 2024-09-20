import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes";
import submissionService from "../services/submission.service";

export async function getSubmissionInfo(req: Request, res: Response, next: NextFunction) {
    const { id  } = req.query;

    submissionService.getSubmissionInfo(id as string)
        .then((submission) => res.status(StatusCodes.OK).json({ message: 'Submission retrieved', submission }))
        .catch(error => next(error))
}

export async function getAllSubmissions(_req: Request, res: Response, next: NextFunction) {
    submissionService.getAllSubmissions()
        .then((submissions) => res.status(StatusCodes.OK).json({ message: 'Submissions retrieved', submissions }))
        .catch(error => next(error))
}

export async function getMySubmissions(_req: Request, res: Response, next: NextFunction) {
    submissionService.getMySubmissions(res.locals.accoun)
        .then((submissions) => res.status(StatusCodes.OK).json({ message: 'Submissions retrieved', submissions }))
        .catch(error => next(error))
}

export async function getProblemSubmissions(req: Request, res: Response, next: NextFunction) {
    const { id  } = req.query;

    submissionService.getProblemSubmissions(id as string)
        .then((submissions) => res.status(StatusCodes.OK).json({ message: 'Submissions retrieved', submissions }))
        .catch(error => next(error))
}

export async function getMyProblemSubmissions(req: Request, res: Response, next: NextFunction) {
    const { id  } = req.query;

    submissionService.getMyProblemSubmissions(res.locals.account, id as string)
        .then((submissions) => res.status(StatusCodes.OK).json({ message: 'Submissions retrieved', submissions }))
        .catch(error => next(error))
}

export async function getRecentProblemSubmissions(req: Request, res: Response, next: NextFunction) {
    const { id  } = req.query;

    submissionService.getRecentProblemSubmissions(res.locals.account, id as string)
        .then((submissions) => res.status(StatusCodes.OK).json({ message: 'Submissions retrieved', submissions }))
        .catch(error => next(error))
}

export default {
    getSubmissionInfo,
    getAllSubmissions,
    getMySubmissions,
    getProblemSubmissions,
    getMyProblemSubmissions,
    getRecentProblemSubmissions
}
