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
        .updateProblem(res.locals.account, input.id, input)
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

export async function addTestCase(req: Request, res: Response, next: NextFunction) {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const { id  } = req.query;

    const inputFile = files['input'][0]
    const outputFile = files['output'][0]

    adminService
        .addTestCase(res.locals.account, id as string, inputFile, outputFile)
        .then((testCase) => res.status(StatusCodes.CREATED).json({ message: "Test case added", testCase }))
        .catch((error) => next(error))
}

export async function editTestCase(req: Request, res: Response, next: NextFunction) {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const { id  } = req.query;

    const inputFile = files['input'][0]
    const outputFile = files['output'][0]

    adminService
        .editTestCase(res.locals.account, id as string, inputFile, outputFile)
        .then((testCase) => res.status(StatusCodes.OK).json({ message: "Test case updated", testCase }))
        .catch((error) => next(error))
}

export async function removeTestCase(req: Request, res: Response, next: NextFunction) {
    const { id  } = req.query;

    adminService
        .removeTestCase(res.locals.account, id as string)
        .then(() => res.status(StatusCodes.OK).json({ message: "Test case removed" }))
        .catch((error) => next(error))
}

export async function getTestCase(req: Request, res: Response, next: NextFunction) {
    const { id  } = req.query;

    adminService
        .getTestCase(id as string)
        .then((testCase) => res.status(StatusCodes.OK).json({ message: "Test case retrieved", testCase }))
        .catch((error) => next(error))
}

export async function getTestCases(req: Request, res: Response, next: NextFunction) {
    const { id  } = req.query;

    adminService
        .getTestCases(id as string)
        .then((testCases) => res.status(StatusCodes.OK).json({ message: "Test cases retrieved", testCases }))
        .catch((error) => next(error))
}

export async function changeTestCaseVisibility(req: Request, res: Response, next: NextFunction) {
    const { id  } = req.query;
    const { visible } = req.body;

    adminService
        .changeTestCaseVisibility(res.locals.account, id as string, visible as boolean)
        .then((testCase) => res.status(StatusCodes.OK).json({ message: "Test case updated", testCase }))
        .catch((error) => next(error))
}

export async function getLanguages(_req: Request, res: Response, next: NextFunction) {
    adminService
        .getLanguages()
        .then((languages) => res.status(StatusCodes.OK).json({ message: "Languages retrieved", languages }))
        .catch((error) => next(error))
}

export async function getLanguage(req: Request, res: Response, next: NextFunction) {
    const { id  } = req.query;

    adminService
        .getLanguage(id as string)
        .then((language) => res.status(StatusCodes.OK).json({ message: "Language retrieved", language }))
        .catch((error) => next(error))
}

export async function addLanguage(req: Request, res: Response, next: NextFunction) {
    const { id, fileExtension, compile, compileCommand, runCommand } = req.body;

    adminService
        .addLanguage(res.locals.account, fileExtension as string, id as string, compile as boolean, compileCommand as string, runCommand as string)
        .then((language) => res.status(StatusCodes.OK).json({ message: "Language added", language }))
        .catch((error) => next(error))
}

export async function updateLanguage(req: Request, res: Response, next: NextFunction) {
    const { id, fileExtension, compile, compileCommand, runCommand } = req.body;

    adminService
        .updateLanguage(res.locals.account, fileExtension as string, id as string, compile as boolean, compileCommand as string, runCommand as string)
        .then((language) => res.status(StatusCodes.OK).json({ message: "Language updated", language }))
        .catch((error) => next(error))
}

export async function deleteLanguage(req: Request, res: Response, next: NextFunction) {
    const { id  } = req.query;

    adminService
        .deleteLanguage(id as string)
        .then(() => res.status(StatusCodes.OK).json({ message: "Language deleted" }))
        .catch((error) => next(error))
}

export async function getContests(_req: Request, res: Response, next: NextFunction) {

    adminService
        .getContests()
        .then((contests) => res.status(StatusCodes.OK).json({ message: "Contests retrieved", contests }))
        .catch((error) => next(error))
}

export async function getContest(req: Request, res: Response, next: NextFunction) {
    const { id } = req.query;

    adminService
        .getContest(id as string)
        .then((contest) => res.status(StatusCodes.OK).json({ message: "Contest retrieved", contest }))
        .catch((error) => next(error))
}

export async function createContest(req: Request, res: Response, next: NextFunction) {
    const { title, startDate, endDate } = req.body;

    adminService
        .createContest(res.locals.account, title, startDate, endDate)
        .then((contests) => res.status(StatusCodes.OK).json({ message: "Contests retrieved", contests }))
        .catch((error) => next(error))
}

export async function addContestProblem(req: Request, res: Response, next: NextFunction) {
    const { problemId, contestId, id } = req.body;

    adminService
        .addContestProblem(res.locals.account, problemId, contestId, id)
        .then(() => res.status(StatusCodes.OK).json({ message: "Problem added" }))
        .catch((error) => next(error))
}

export async function removeContestProblem(req: Request, res: Response, next: NextFunction) {
    const { problemId, contestId } = req.body;

    adminService
        .removeContestProblem(res.locals.account, problemId, contestId)
        .then(() => res.status(StatusCodes.OK).json({ message: "Problem removed" }))
        .catch((error) => next(error))
}

export default {
    getUsers,
    updateUser,
    getLogs,
    createProblem,
    getProblem,
    getProblems,
    updateProblem,
    addTestCase,
    editTestCase,
    removeTestCase,
    getTestCases,
    getTestCase,
    changeTestCaseVisibility,
    getLanguage,
    getLanguages,
    addLanguage,
    updateLanguage,
    deleteLanguage,
    getContests,
    getContest,
    createContest,
    addContestProblem,
    removeContestProblem
}
