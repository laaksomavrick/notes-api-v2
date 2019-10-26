import { Request, Response, Router } from "express";
import { Handler } from "./Handler";

export class HelloWorldHandler extends Handler {
    public path = "*";

    constructor(router: Router) {
        super(router);
    }

    public bindRoute(): void {
        this.router.get(this.path, this.handle.bind(this));
    }

    public handle(req: Request, res: Response): void {
        this.httpOk(res, { hello: "world" });
    }
}
