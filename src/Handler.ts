import { Request, Response, Router } from "express";
import { HttpResponder } from "./HttpResponder";

export abstract class Handler extends HttpResponder {
    protected abstract readonly path: string;

    protected abstract handle(req: Request, res: Response): Promise<void> | void;

    public abstract bindRoute(): void;

    protected readonly router: Router;

    protected constructor(router: Router) {
        super();
        this.router = router;
    }
}
