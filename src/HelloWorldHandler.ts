import { Request, Response } from "express";
import { Handler } from "./Handler";

export class HelloWorldHandler extends Handler {
    public getHandler(): (req: Request, res: Response) => Promise<void> | void {
        return this.handle.bind(this);
    }

    protected handle(req: Request, res: Response): void {
        this.httpOk(res, { hello: "world" });
    }
}
