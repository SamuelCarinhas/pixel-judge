import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import logger from "./logger.util";
import { BadRequest } from "./error.util";
import { generateError } from "zod-error";

export function validate(schema: z.AnyZodObject | z.ZodOptional<z.AnyZodObject>) {
    return async (req: Request, _res: Response, next: NextFunction)=> {
        try {
            await schema.parseAsync({ body: req.body, params: req.params, query: req.query })
            return next()
        } catch (e) {
            logger.error(e)
            if (e instanceof z.ZodError) {
                return next(new BadRequest(generateError(e).message))
            }
        }
    }
}
