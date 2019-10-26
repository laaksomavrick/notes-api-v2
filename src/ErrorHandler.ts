import { Express, NextFunction, Request, Response } from "express";
import { HttpError } from "./HttpError";
import { HttpResponder } from "./HttpResponder";

export class ErrorHandler extends HttpResponder {
    private app: Express;

    constructor(app: Express) {
        super();
        this.app = app;
    }

    public bindHandler(): void {
        this.app.use(this.handle.bind(this));
    }

    public handle(error: HttpError, req: Request, res: Response, next: NextFunction): void {
        const status = error.status || 500;
        this.httpError(res, error, status);
    }
}
