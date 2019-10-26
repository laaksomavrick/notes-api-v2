import { Request, Response, Router } from "express";
import { HttpError } from "./HttpError";

export abstract class Handler {
    protected abstract readonly path: string;

    protected abstract handle(req: Request, res: Response): Promise<void> | void;

    public abstract bindRoute(): void;

    protected readonly router: Router;

    protected constructor(router: Router) {
        this.router = router;
    }

    public httpOk(res: Response, resource: object, status: number = 200): void {
        res.status(status).send({
            resource,
        });
    }

    public httpError(res: Response, error: HttpError, status: number = 500): void {
        res.status(status).send({
            error: {
                errors: error.errors,
                msg: error.toString(),
            },
            status,
        });
    }
}
