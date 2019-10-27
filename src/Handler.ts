import { Request, Response } from "express";
import { HttpResponder } from "./HttpResponder";

export abstract class Handler extends HttpResponder {
    protected abstract handle(req: Request, res: Response): Promise<void> | void;

    protected abstract getHandler(): (req: Request, res: Response) => Promise<void> | void;
}
