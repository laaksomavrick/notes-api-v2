import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../HttpError";
import { Middleware } from "../Middleware";

export interface ICreateUserDto {
    user: {
        email: string;
        password: string;
    };
}

// tslint:disable-next-line:no-any
function isICreateUserDto(arg: any): arg is ICreateUserDto {
    if (arg == null) {
        return false;
    }

    if (arg.user == null) {
        return false;
    }

    const emailOk = arg.user.email != null;
    const passwordOk = arg.user.password != null;

    return emailOk && passwordOk;
}

export class CreateUserMiddleware extends Middleware {
    public getHandler(): (req: Request, res: Response, next: NextFunction) => Promise<void> | void {
        return this.handle.bind(this);
    }

    protected handle(req: Request, res: Response, next: NextFunction): Promise<void> | void {
        try {
            const dtoOk = isICreateUserDto(req.body);

            if (dtoOk === false) {
                throw new ValidationError(undefined);
            }

            next();
        } catch (e) {
            next(e);
        }
    }
}
