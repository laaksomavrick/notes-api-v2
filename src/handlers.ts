import { Request, Response } from "express";

export function helloWorldHandler(req: Request, res: Response): void {
    res.json({ hello: "world" });
}
