import { NextFunction, Request, Response } from "express";
import { MulterError } from "multer";
import { BadRequest } from "../utils/error.util";
import { SubmissionMulter } from "../utils/multer.util";
import { rmSync } from 'fs';

export function uploadSubmission() {
    return (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.query;
        const upload = SubmissionMulter(id as string).single('code');

        upload(req, res, (err) => {
            if(err instanceof MulterError) return next(new BadRequest(err.message));
            if(err) next(err);
            if(!req.file) {
                return next(new BadRequest("No file uploaded"));
            }
            next();
        })
    }
}

export default {
    uploadSubmission
}