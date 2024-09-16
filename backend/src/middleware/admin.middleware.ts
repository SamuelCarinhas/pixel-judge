import { NextFunction, Request, Response } from "express";
import { MulterError } from "multer";
import { BadRequest } from "../utils/error.util";
import { TestCaseMulter } from "../utils/multer.util";
import { rmSync } from 'fs';

export function uploadTestCases() {
    return (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.query;
        const upload = TestCaseMulter(id as string).fields([
            {
                name: "input",
                maxCount: 1
            },
            {
                name: "output",
                maxCount: 1
            }
        ]);

        upload(req, res, (err) => {
            if(err instanceof MulterError) return next(new BadRequest(err.message));
            if(err) next(err);

            const files = req.files as { [fieldname: string]: Express.Multer.File[] }; 

            if(!files || !files['input'] || !files['output']) {
                if(files['input'])
                    rmSync(files['input'][0].path)

                if(files['output'])
                    rmSync(files['output'][0].path)
                return next(new BadRequest("Both input and output files must be uploaded"));
            }
            next();
        })
    }
}

export default {
    uploadTestCases
}