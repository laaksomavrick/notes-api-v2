import { NextFunction, Request, Response } from "express";
import { Application } from "./Application";
import { Context } from "./framework/Context";
import { HttpResponder } from "./framework/HttpResponder";

export class RequestLogger extends HttpResponder {
    private app: Application;

    constructor(app: Application) {
        super();
        this.app = app;
    }

    public bindHandler(): void {
        this.app.server.use(this.handle.bind(this));
    }

    public handle(req: Request, res: Response, next: NextFunction): void {
        const context = new Context();
        // tslint:disable-next-line:no-any
        (req as any).context = context;
        next();
    }
}
