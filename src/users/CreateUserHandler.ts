import { Request, Response } from "express";
import { Handler } from "../Handler";
import { ICreateUserDto } from "./CreateUserMiddleware";

export class CreateUserHandler extends Handler {
    public getHandler(): (req: Request, res: Response) => void {
        return this.handle.bind(this);
    }

    protected handle(req: Request, res: Response): void {
        const dto = req.body as ICreateUserDto;
        this.httpOk(res, { user: dto });
    }
}
