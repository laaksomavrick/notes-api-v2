import { Request, Response } from "express";
import { Handler } from "./Handler";

export class HelloWorldHandler extends Handler {
    public path = "*";

    constructor() {
        super();
    }

    public handle(req: Request, res: Response): void {
        this.httpOk(res, { hello: "world" });
    }
}
