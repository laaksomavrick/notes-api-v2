import { NextFunction, Request, Response } from "express";
import { Application } from "./Application";
import { HttpError } from "./HttpError";
import { HttpResponder } from "./HttpResponder";

export class ErrorHandler extends HttpResponder {
    private app: Application;

    constructor(app: Application) {
        super();
        this.app = app;
    }

    public bindHandler(): void {
        this.app.server.use(this.handle.bind(this));
    }

    public handle(error: HttpError, req: Request, res: Response, next: NextFunction): void {
        console.log("Error handler invoked");
        const status = error.status || 500;
        this.httpError(res, error, status);
    }
}
