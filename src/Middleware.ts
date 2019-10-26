import { NextFunction, Request, Response } from "express";
import { HttpResponder } from "./HttpResponder";

export abstract class Middleware extends HttpResponder {
    protected abstract handle(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> | void;

    protected constructor() {
        super();
    }
}
